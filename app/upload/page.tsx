'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UploadPage(){
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpload(){
    if(!file) return alert('Pick a video')
    setLoading(true)
    try{
      const name = Date.now()+'-'+file.name
      const { error: upErr } = await supabase.storage.from('videos').upload(name, file)
      if(upErr) throw upErr
      const { data } = supabase.storage.from('videos').getPublicUrl(name)
      const { error: dbErr } = await supabase.from('posts').insert({ video_url: data.publicUrl, caption })
      if(dbErr) throw dbErr
      router.push('/')
    }catch(e:any){ alert(e.message) }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      <input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="w-full mb-4 p-3 bg-zinc-800 rounded"/>
      <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Write caption..." className="w-full p-3 bg-zinc-800 rounded mb-4 h-24"/>
      <button onClick={handleUpload} disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-full">{loading?'Uploading...':'Post'}</button>
      <button onClick={()=>router.push('/')} className="w-full mt-4 text-zinc-400">Back</button>
    </div>
  )
}
