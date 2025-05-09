import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const StudentView = DialogPrimitive.Root;

const StudentViewContent = ({ children }: { children: React.ReactElement }) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
        className="fixed bg-black/80 z-50 inset-0"
        >
          <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
          p-4
          z-50 grid w-full max-w-5xl rounded-lg shadow-lg border bg-background"
          >
            <VisuallyHidden>
              <DialogPrimitive.DialogTitle>
                Student Preference Dialog
              </DialogPrimitive.DialogTitle>
            </VisuallyHidden>
            {children}
            <DialogPrimitive.Close
            className="absolute right-1.5 top-1.5">
              <X />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    );
  }

  export {
    StudentView, 
    StudentViewContent
  }
