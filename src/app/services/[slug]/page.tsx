"use client"
import React from 'react'
import ServiceDetailClient from '../../../../utils/services/service-detail-client'
import { useParams } from 'next/navigation'
const page = () => {
    const  params = useParams<{ slug: string }>()
    console.log('Service slug:', params.slug)
  return (
    <div>
        <ServiceDetailClient slug={params.slug}/>
    </div>
  )
}

export default page