"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from "~/components/ui/button";
import { Toaster, useToast } from "~/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";

interface HomepageContentData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  mainContent: string;
}

interface HomepageContentResponse {
  content: HomepageContentData | undefined | null;
  error: boolean;
  message?: string;
}

interface UpdateActionResult {
  error: boolean;
  message?: string;
}

interface UpdateHomeFormProps {
  content: HomepageContentResponse;
  updateAction: (formData: FormData) => Promise<UpdateActionResult>;
}

export default function UpdateHomeForm({ content, updateAction }: UpdateHomeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const contentData = content?.content;
  const [originalValues, setOriginalValues] = useState({
    heroTitle: contentData?.heroTitle || "Where Education Meets Application",
    heroSubtitle: contentData?.heroSubtitle || "Show employers you have what it takes.",
    mainContent: contentData?.mainContent || "The Oregon State University EECS Project Showcase assists students in obtaining internships and full-time employment by providing the opportunity to build a portfolio of projects they have completed."
  });
  
  const [currentValues, setCurrentValues] = useState({...originalValues});
  
  const [editedFields, setEditedFields] = useState({
    heroTitle: false,
    heroSubtitle: false,
    mainContent: false
  });
  
  useEffect(() => {
    if (contentData) {
      const newOriginal = {
        heroTitle: contentData.heroTitle,
        heroSubtitle: contentData.heroSubtitle,
        mainContent: contentData.mainContent
      };
      setOriginalValues(newOriginal);
      setCurrentValues(newOriginal);
      
      setEditedFields({
        heroTitle: false,
        heroSubtitle: false,
        mainContent: false
      });
    }
  }, [contentData]);
  
  const handleInputChange = (field: keyof typeof currentValues, value: string) => {
    setCurrentValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    setEditedFields(prev => ({
      ...prev,
      [field]: value !== originalValues[field]
    }));
  };
  
  const hasChanges = Object.values(editedFields).some(edited => edited);
  
  function handlePreSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFormData(data);
    setShowConfirmDialog(true);
  }
  
  async function handleConfirmedSubmit() {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateAction(formData);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to update homepage content",
        });
      } else {
        toast({
          title: "Success",
          description: "Homepage content updated successfully",
        });
        
        setOriginalValues({...currentValues});
        setEditedFields({
          heroTitle: false,
          heroSubtitle: false,
          mainContent: false
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  }
  
  function handleRevertChanges() {
    setCurrentValues({...originalValues});
    setEditedFields({
      heroTitle: false,
      heroSubtitle: false,
      mainContent: false
    });
    
    toast({
      title: "Changes Reverted",
      description: "All changes have been discarded",
    });
  }

  return ( 
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Homepage Content</h1>
      
      <Card>
        <CardContent>
          <form onSubmit={handlePreSubmit}>
            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <label htmlFor="heroTitle" className="flex items-center gap-2">
                  Title
                  {editedFields.heroTitle && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Edited
                    </Badge>
                  )}
                </label>
                <Input 
                  id="heroTitle" 
                  name="heroTitle" 
                  value={currentValues.heroTitle}
                  onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                  className={editedFields.heroTitle ? "border-yellow-400" : ""}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="heroSubtitle" className="flex items-center gap-2">
                  Subtitle
                  {editedFields.heroSubtitle && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Edited
                    </Badge>
                  )}
                </label>
                <Input 
                  id="heroSubtitle" 
                  name="heroSubtitle" 
                  value={currentValues.heroSubtitle}
                  onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
                  className={editedFields.heroSubtitle ? "border-yellow-400" : ""}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="mainContent" className="flex items-center gap-2">
                  Content
                  {editedFields.mainContent && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Edited
                    </Badge>
                  )}
                </label>
                <Textarea 
                  id="mainContent" 
                  name="mainContent" 
                  rows={5}
                  value={currentValues.mainContent}
                  onChange={(e) => handleInputChange("mainContent", e.target.value)}
                  className={editedFields.mainContent ? "border-yellow-400" : ""}
                  required
                />
              </div>
              <div className="flex justify-center gap-4 mt-6">
                {hasChanges && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleRevertChanges}
                  >
                    Revert Changes
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !hasChanges}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Content'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the homepage content?
              These changes will be visible to all users immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center gap-4 mt-6">
            <AlertDialogCancel className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmedSubmit}
              className="m-0"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Confirm Update'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}