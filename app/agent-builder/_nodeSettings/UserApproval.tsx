import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileJson } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const UserApproval = ({selectedNode,updateFormData}:any) => {
    const [formData, setFormData] = useState({ name: '',message:'' });
  
      const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const onSave = () => {
    updateFormData(formData);
    toast.success("Settings updated!");
  };

    useEffect(() => {
      if (selectedNode?.data?.settings) {
        setFormData(selectedNode.data.settings);
      }
    }, [selectedNode]);
    return (
    <div>
       <h2 className="font-bold mt-2">User Approval</h2>
      <p className="text-gray-500 mt-2">Pause for human for approve or reject</p>
      <div className="mt-3 space-y-1">
        <Label>Name</Label>
        <Input
          placeholder="Agent Name"
          value={formData?.name}
          onChange={(event) => handleChange('name', event.target.value)}
        />
      </div>

      <div className="mt-3 space-y-1">
        <Label>Message</Label>
        <Textarea
          placeholder="Give Message"
          value={formData.message}
          onChange={(event) => handleChange('message', event.target.value)}
        />
        <h2 className="text-sm p-1 flex gap-2 items-center">
          Add Context <FileJson />
        </h2>
      </div>
   <Button className="w-full mt-5" onClick={onSave}>
        Save
      </Button>

    </div>
  )
}

export default UserApproval
