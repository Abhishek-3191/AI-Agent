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
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'   // ✅ IMPORTANT: use next/navigation
import { UserDetailContext } from '@/context/UserDetailContext'
 
const CreateAgentSection = () => {

  const router = useRouter();                     // ✅ MOVE HOOK TO TOP
  const [openDialog, setOpenDialog] = useState(false);
  const CreateAgentMutation = useMutation(api.agent.CreateAgent);
  const [agentName, setAgentName] = useState<string>();
  const [loader, setLoader] = useState(false);
  const { userDetail } = useContext(UserDetailContext);

  const CreateAgent = async () => {
    const agentId = uuidv4();
    setLoader(true);

    await CreateAgentMutation({
      agentId: agentId,
      name: agentName ?? '',
      userId: userDetail?._id
    });

    setLoader(false);
    setOpenDialog(false);

    // Navigate
    router.push('/agent-builder/' + agentId);     // ✅ FIXED URL + router works now
  };

  return (
    <div className='space-y-2 flex flex-col justify-center items-center mt-24'>
      <h2 className='font-bold text-xl'>Create AI agent</h2>
      <p className="text-lg">Build AI workflow with custom logic and tools</p>
    
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size={'lg'}><Plus />Create</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter agent name</DialogTitle>
            <DialogDescription>
              <Input placeholder='Enter the name'
                onChange={(e) => setAgentName(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={CreateAgent} disabled={loader}>
                {loader && <Loader2Icon className='animate-spin' />}
                Create
              </Button>
            </DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>
    </div>
  )
}

export default CreateAgentSection;
