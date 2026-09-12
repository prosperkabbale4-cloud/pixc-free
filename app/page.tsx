'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home(){
  const [posts, setPosts] = useState<any[]>([])
  useEffect(()=>{
    supabase.from('posts').select('*').order('created_at',{ascending:false}).then(({data})=>{ if(data) setPosts(data) })
  },[])
  return(
    <div className="min-h-screen bg-black text-white max-w-md mx-auto relative">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <h1 className="font-bold text-xl">PiX-C</h1>
        <Link href="/upload" className="bg-white text-black px-5 py-2 rounded-full font-bold">+</Link>
      </div>
      <div className="divide-y divide-zinc-800">
        {posts.map(p=>(
          <div key={p.id} className="p-4">
            <video src={p.video_url} controls loop className="w-full rounded-xl bg-zinc-900" />
            <p className="mt-2">{p.caption}</p>
          </div>
        ))}
        {posts.length===0 && <p className="p-10 text-center text-zinc-500">No videos yet. Tap + to upload!</p>}
      </div>
    </div>
  )
}
