import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { deleteCategory } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}




export function DeleteInvoice({ id }: { id: string }) {

  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}



export function CreateProduct() {
  return (
    <Link
      href= "/dashboard/products/create"
      className='flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white'
      >
        <span className='hidden md:block'>Nuevo Producto</span>
        <PlusIcon className='h-5 md:ml-4'/>
      </Link>
  )
}


export function CreateCategory() {
  return (
    <Link href="/dashboard/categories/create" className='flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
      <span className='hidden md:block'>Nueva Categoria</span>
      <PlusIcon className='h-5 md:ml-4'/>
    </Link>
  )
}

export function DeleteCategory({id}: {id: string}) {
  const deleteCategoryWithId = deleteCategory.bind(null, id);

  return(
    <form action={deleteCategoryWithId}>
      <button type='submit' className='rounded-md border p-2 hover:bg-red-100 hover:text-red-600 text-red-500'>
        <span className='sr-only'>Eliminar Categoria</span>
        <TrashIcon className='w-5'/>
      </button>
    </form>
  )
}