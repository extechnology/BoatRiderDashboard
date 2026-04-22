import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { contacts } from "@/lib/mock-data";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
            <p className="text-sm text-muted-foreground">{contacts.length} messages</p>
          </div>
          <ExportToolbar data={contacts as any} filename="contacts" />
        </div>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-3 text-foreground">{c.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === "new" ? "bg-primary/10 text-primary" :
                      c.status === "replied" ? "bg-success/10 text-success" :
                      "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}