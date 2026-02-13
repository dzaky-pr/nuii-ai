'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { IMaterialWithTimestamps } from '@/lib/types/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  UpdateMaterial,
  useUpdateMaterialMutation
} from '../_hooks/@update/EditMaterialMutation'

type EditMaterialFormProps = {
  material: IMaterialWithTimestamps
}

export default function EditMaterialForm({ material }: EditMaterialFormProps) {
  const router = useRouter()

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const { mutate, isPending } = useUpdateMaterialMutation({
    materialId: material.id
  })
  const { register, handleSubmit } = useForm<UpdateMaterial>({
    defaultValues: {
      id_tipe_material: material.id_tipe_material,
      nama_material: material.nama_material,
      nomor_material: material.nomor_material,
      satuan: material.satuan_material,
      berat: Number(material.berat_material),
      harga_material: material.harga_material,
      pasang_rab: material.pasang_rab,
      bongkar: material.bongkar,
      jenis_material: material.jenis_material,
      kategori_material: material.kategori_material
    }
  })

  function onSubmit(data: UpdateMaterial) {
    mutate(data, {
      onSuccess: function () {
        toast.success('Material berhasil diperbarui!')
        setIsSheetOpen(false)
        router.push('/dashboard/manage-materials')
      },
      onError: function () {
        toast.error('Gagal memperbarui material, silakan coba lagi.')
      }
    })
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600">
          Edit Material
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Material</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-1">
            <Label htmlFor="id_tipe_material">ID Tipe Material</Label>
            <Input
              id="id_tipe_material"
              type="number"
              {...register('id_tipe_material', { valueAsNumber: true })}
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
