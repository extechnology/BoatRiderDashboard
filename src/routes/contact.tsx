import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { contacts } from "@/lib/mock-data";
import { useContactListQuery } from "@/features/contact/hooks.contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contactsData, isLoading } = useContactListQuery();

  const results = contactsData?.results || [];

  const filteredContacts = results.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
            <p className="text-sm text-muted-foreground">{filteredContacts.length} messages</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
              />
            </div>
            <ExportToolbar data={filteredContacts} filename="contacts" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((c: any) => (
                    <tr key={c.enquiry_id} className="border-b border-border/50 last:border-0">
                      <td className="px-5 py-3 text-foreground font-medium">{c.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.phone}</td>
                      <td className="px-5 py-3 text-foreground">{c.subject}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(c.created).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}