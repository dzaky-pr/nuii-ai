export const surveyKeys = {
  all: ['survey'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}

export const surveyHeaderKeys = {
  all: ['surveyHeader'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}

export const surveyDetailKeys = {
  all: ['surveyDetail'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}

export const sktmKeys = {
  all: ['sktm'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}

export const sutmKeys = {
  all: ['sutm'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}

export const cubicleKeys = {
  all: ['cubicle'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.all, 'detail', id] as const
}
