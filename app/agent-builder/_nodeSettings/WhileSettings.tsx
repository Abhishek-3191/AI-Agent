import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function WhileSettings({selectedNode,updateFormData}:any) {
    const [formData, setFormData] = useState({ condition: '' });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    }
  }, [selectedNode]);

  const onSave = () => {
    updateFormData(formData);
    toast.success("Condition saved!");
  };
  return (
     <div>
      <h2 className="font-bold mt-4">Loop </h2>
      <p className="text-gray-500 mt-2">Write your logic</p>

      <div className="mt-3">
        <Label>Loop</Label>
        <Input
          placeholder="Enter condition"
          value={formData?.condition}
          onChange={(e) => setFormData({ condition: e.target.value })}
        />
      </div>

      <Button className="w-full mt-5" onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default WhileSettings
