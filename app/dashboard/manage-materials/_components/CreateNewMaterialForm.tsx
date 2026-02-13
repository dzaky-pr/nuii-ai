'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateMaterialMutation } from '../_hooks/@create/useCreateNewMaterialMutation'
import { useGetAllTipeMaterial } from '../_hooks/@read/useGetAllTipeMaterial'

export type CreateNewMaterial = {
  id_tipe_material: number
  nama_material: string
  nomor_material: number
  satuan: string
  berat: number
  harga_material: number
  pasang_rab: number
  bongkar: number
  jenis_material: string
  kategori_material: string
}

export default function CreateNewMaterialForm() {
  const router = useRouter()

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const { mutate, isPending } = useCreateMaterialMutation()
  const { register, handleSubmit, reset, control } =
    useForm<CreateNewMaterial>()
  const { listTipeMaterial, loadingListTipeMaterial } = useGetAllTipeMaterial()

  const onSubmit = (data: CreateNewMaterial) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Material baru berhasil ditambahkan!')
        setIsSheetOpen(false)
        reset()
        router.push('/dashboard/manage-materials')
      },
      onError: () => {
        toast.error('Gagal menambahkan material, silakan coba lagi.')
      }
    })
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex flex-col md:flex-row gap-2">
        <SheetTrigger asChild>
          <Button className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
            Add Material
          </Button>
        </SheetTrigger>
        <Button className="bg-slate-500 px-4 py-2 rounded-lg hover:bg-slate-600">
          <Link href="/dashboard/log-history">Log Material</Link>
        </Button>
      </div>
      <SheetContent className="w-full sm:max-w-lg p-6">
        <SheetHeader>
          <SheetTitle>Create New Material</SheetTitle>
          <SheetDescription>Masukkan detail material baru</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-1">
            <Label htmlFor="id_tipe_material">ID Tipe Material</Label>
            <Controller
              control={control}
              name="id_tipe_material"
              render={({ field }) => (
                <Select
                  onValueChange={val => field.onChange(Number(val))}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Material" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingListTipeMaterial ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      listTipeMaterial?.map(tipe => (
                        <SelectItem key={tipe.id} value={tipe.id.toString()}>
                          {tipe.tipe_material}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="nama_material">Nama Material</Label>
            <Input
              id="nama_material"
              type="text"
              {...register('nama_material', { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="nomor_material">Nomor Material</Label>
            <Input
              id="nomor_material"
              type="number"
              {...register('nomor_material', {
                valueAsNumber: true,
                required: true
              })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              type="text"
              {...register('satuan', { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="berat">Berat</Label>
            <Input
              id="berat"
              type="number"
              step="0.1"
              {...register('berat', { valueAsNumber: true, required: true })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="harga_material">Harga Material</Label>
            <Input
              id="harga_material"
              type="number"
              {...register('harga_material', {
                valueAsNumber: true,
                required: true
              })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="pasang_rab">Pasang RAB</Label>
            <Input
              id="pasang_rab"
              type="number"
              {...register('pasang_rab', {
                valueAsNumber: true,
                required: true
              })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="bongkar">Bongkar</Label>
            <Input
              id="bongkar"
              type="number"
              {...register('bongkar', { valueAsNumber: true, required: true })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="jenis_material">Jenis Material</Label>
            <Input
              id="jenis_material"
              type="text"
              {...register('jenis_material', { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="kategori_material">Kategori Material</Label>
            <Input
              id="kategori_material"
              type="text"
              {...register('kategori_material', { required: true })}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
