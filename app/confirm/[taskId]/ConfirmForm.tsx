"use client";

import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import confirmTaskDone from "./actions";
import lang from "@/dictionaries/lang.json";
import { experimental_useFormState as useFormState } from "react-dom";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

const ConfirmButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="px-8 mx-auto" disabled={pending}>
      {lang.confirm.submit}
    </Button>
  );
};

export const ConfirmForm = ({ taskId }: { taskId: string }) => {
  const [_state, formAction] = useFormState(confirmTaskDone, { message: null });

  return (
    <form action={formAction} className="flex flex-col gap-4 my-8">
      <Input name="task_id" type="hidden" value={taskId} />
      <Label htmlFor="file">{lang.confirm.uploadFile}</Label>
      <Input name="file" id="file" type="file" required={true} />
      <Label htmlFor="completed_date">{lang.confirm.completedDate}</Label>
      <Input
        name="completed_date"
        id="completed_date"
        type="date"
        required={true}
        defaultValue={new Date().toLocaleDateString("en-CA")}
      />
      <Label htmlFor="revenue">{lang.confirm.revenue}</Label>
      <Input
        name="revenue"
        id="revenue"
        pattern="^\d+(?:[.,]\d{1,2})?\s*€?$"
        required={true}
      />
      <Label htmlFor="amount">{lang.confirm.amount}</Label>
      <Input name="amount" id="amount" type="number" required={true} />

      <div className="flex gap-2">
        <Checkbox id="equipment" required={true} />
        <div className="flex flex-col">
          <Label htmlFor="equipment">{lang.confirm.returnedEquipment}</Label>
          <p className="text-sm text-muted-foreground">
            {lang.confirm.returnedEquipmentDescription}
          </p>
        </div>
      </div>
      <ConfirmButton/>
    </form>
  );
};

export default ConfirmForm;
