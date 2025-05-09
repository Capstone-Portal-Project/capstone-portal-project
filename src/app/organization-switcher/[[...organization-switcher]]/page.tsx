import { OrganizationSwitcher } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';

export default function OrganizationSwitcherPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 pb-12">
      <Card className="w-full max-w-lg max-h-lg shadow-xl">
        <CardHeader>
          <CardTitle>Switch Organization</CardTitle>
          <CardDescription>
            As an admin, select the organization (course) you'd like to manage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationSwitcher
            appearance={{
              elements: {
                card: 'bg-white',
                buttonPrimary: 'bg-primary text-white rounded-md px-4 py-2 hover:bg-primary/90',
                buttonSecondary: 'bg-muted text-muted-foreground rounded-md px-4 py-2',
              },
            }}
            afterSelectOrganizationUrl="/instructor"
            afterLeaveOrganizationUrl="/"
            hidePersonal={true}
            defaultOpen={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
