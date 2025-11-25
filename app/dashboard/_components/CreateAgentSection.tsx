"use client"
import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Plus } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid';
import { useRouter } from 'next/router'
import { UserDetailContext } from '@/context/UserDetailContext'
 
const CreateAgentSection = () => {
    const [openDialog,setOpenDialog]=useState(false);
    const CreateAgentMutation=useMutation(api.agent.CreateAgent);
    const [agentName,setAgentName]=useState<string>();
    const [loader,setLoader]=useState(false);
    const {userDetail,setUserDetail}=useContext(UserDetailContext);

    const CreateAgent=async()=>{
    const agentId=uuidv4(); //Generate unique id
    const router=useRouter();
   setLoader(true);

    const result=await CreateAgentMutation({
        agentId:agentId,
        name:agentName?? '',
        userId:userDetail?._id
    })
    setOpenDialog(false);
     setLoader(false);
    //Navigate to agent builder screen
    router.push('/agent-builder'+agentId);
    }
  return (
    <div className='space-y-2 flex flex-col justify-center items-center mt-24'>
    <h2 className='font-bold text-xl'>Create AI agent</h2>
    <p className="text-lg">Build AI workflow with custom logic and tools</p>
    
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger asChild><Button size={'lg'} onClick={()=>setOpenDialog}><Plus/>Create</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Enter agent name</DialogTitle>
      <DialogDescription>
      <Input placeholder='Enter the name' onChange={(event)=>setAgentName(event.target.value)}/>
      </DialogDescription>
    </DialogHeader>
     <DialogFooter>
        <DialogClose asChild>
    <Button onClick={()=>CreateAgent()} disabled={loader}>
        {loader && <Loader2Icon className='animate-spin'/>}
        Create</Button>
    </DialogClose >
      <Button variant={'ghost'}>Cancel</Button>
  </DialogFooter>
  </DialogContent>
 
</Dialog>
    </div>
  )
}

export default CreateAgentSection
