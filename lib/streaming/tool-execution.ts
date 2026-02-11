import { generateId, generateText, ModelMessage, UIMessageStreamWriter } from 'ai'
import { z } from 'zod'
import { searchSchema } from '../schema/search'
import { search } from '../tools/search'
import type { ChatUIMessage } from '../types'
import { getToolCallModel } from '../utils/registry'
import { parseToolCallXml } from './parse-tool-call'

export async function executeToolCall(
  coreMessages: ModelMessage[],
  writer: UIMessageStreamWriter<ChatUIMessage>,
  model: string,
  searchMode: boolean
): Promise<ModelMessage[]> {
  // If search mode is disabled, return empty tool call
  if (!searchMode) {
    return []
  }

  const toolCallModel = getToolCallModel(model)
  if (!toolCallModel) {
    throw new Error('No valid tool call model found')
  }
  // Convert Zod schema to string representation
  const searchSchemaString = Object.entries(searchSchema.shape)
    .map(([key, value]) => {
      const description = value.description
      const isOptional = value instanceof z.ZodOptional
      return `- ${key}${isOptional ? ' (optional)' : ''}: ${description}`
    })
    .join('\n')
  const defaultMaxResults = model?.includes('ollama') ? 5 : 20

  // Generate tool selection using XML format
  const toolSelectionResponse = await generateText({
    model: toolCallModel,
    system: `You are an intelligent assistant that analyzes conversations to select the most appropriate tools and their parameters.
            You excel at understanding context to determine when and how to use available tools, including crafting effective search queries.
            Current date: ${new Date().toISOString().split('T')[0]}

            Do not include any other text in your response.
            Respond in XML format with the following structure:
            <tool_call>
              <tool>tool_name</tool>
              <parameters>
                <query>search query text</query>
                <max_results>number - ${defaultMaxResults} by default</max_results>
                <search_depth>basic or advanced</search_depth>
                <include_domains>domain1,domain2</include_domains>
                <exclude_domains>domain1,domain2</exclude_domains>
              </parameters>
            </tool_call>

            Available tools: search

            Search parameters:
            ${searchSchemaString}

            If you don't need a tool, respond with <tool_call><tool></tool></tool_call>`,
    messages: coreMessages
  })

  // Parse the tool selection XML using the search schema
  const toolCall = parseToolCallXml(toolSelectionResponse.text, searchSchema)

  if (!toolCall || toolCall.tool === '') {
    return []
  }

  const toolCallId = `call_${generateId()}`
  writer.write({
    type: 'data-tool_call',
    id: toolCallId,
    data: {
      state: 'call',
      toolCallId,
      toolName: toolCall.tool,
      args: toolCall.parameters
    }
  })

  // Support for search tool only for now
  const searchResults = await search(
    toolCall.parameters?.query ?? '',
    toolCall.parameters?.max_results,
    toolCall.parameters?.search_depth as 'basic' | 'advanced',
    toolCall.parameters?.include_domains,
    toolCall.parameters?.exclude_domains
  )

  writer.write({
    type: 'data-tool_call',
    id: toolCallId,
    data: {
      state: 'result',
      toolCallId,
      toolName: toolCall.tool,
      args: toolCall.parameters,
      result: searchResults
    }
  })

  const toolCallMessages: ModelMessage[] = [
    {
      role: 'assistant',
      content: `Tool call result: ${JSON.stringify(searchResults)}`
    },
    {
      role: 'user',
      content: 'Now answer the user question.'
    }
  ]

  return toolCallMessages
}
