import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

function IfElseSettings({ selectedNode, updateFormData }: any) {

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
      <h2 className="font-bold mt-2">If-Else Block</h2>
      <p className="text-gray-500 mt-2">Write condition</p>

      <div className="mt-3">
        <Label>If</Label>
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
  );
}

export default IfElseSettings;
