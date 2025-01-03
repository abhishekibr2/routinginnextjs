"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Eye, Edit, Trash, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetPages, InsertPage } from "../../utils/page";
import moment from "moment";

interface PageSchema {
  id: string;
  page_url: string;
  page_title: string;
  page_description: string;
  page_status: "draft" | "published" | "archived";
  page_metadata_title: string;
  page_metadata_description: string;
  page_content: string;
  created_at: string;
}

export default function Home() {
  const [form_data, setFormData] = useState({
    page_url: "",
    page_title: "",
    page_description: "",
    page_status: "draft" as const,
    page_metadata_title: "",
    page_metadata_description: "",
    page_content: null,
    created_at: Date.now()
  });

  const [pages, setPages] = useState<PageSchema[]>([]);
  const [is_submitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is_dialog_open, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const fetchPages = async () => {
    try {
      const response = await GetPages();
      setPages(response.data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {


      const response = await InsertPage(JSON.stringify(form_data));

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to create page");
      }

      setFormData({
        page_url: "",
        page_title: "",
        page_description: "",
        page_status: "draft",
        page_metadata_title: "",
        page_metadata_description: "",
        page_content: null,
        created_at: Date.now()
      });
      fetchPages();
      setIsDialogOpen(false); // Close dialog on successful submission
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      <div className="font-semibold mb-8 text-center p-6 text-4xl">
        Dynamic Routing Management
      </div>

      {/* Pages Table Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Published Pages</CardTitle>
            <div className="flex gap-4">

              {/* Add Page Dialog */}
              <Dialog open={is_dialog_open} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Page
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          name="page_title"
                          value={form_data.page_title}
                          onChange={handleInputChange}
                          placeholder="Page Title"
                          className="mb-2"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          name="page_url"
                          value={form_data.page_url}
                          onChange={handleInputChange}
                          placeholder="Page URL"
                          required
                        />
                      </div>
                      <div>
                        <Select
                          value={form_data.page_status}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, page_status: value as any }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Page Content */}
                    <div className="space-y-4">
                      <Textarea
                        name="page_description"
                        value={form_data.page_description}
                        onChange={handleInputChange}
                        placeholder="Page Description"
                        className="min-h-24"
                        required
                      />
                    </div>

                    {/* SEO Metadata */}
                    <div className="space-y-4">
                      <Input
                        type="text"
                        name="page_metadata_title"
                        value={form_data.page_metadata_title}
                        onChange={handleInputChange}
                        placeholder="SEO Title"
                      />
                      <Textarea
                        name="page_metadata_description"
                        value={form_data.page_metadata_description}
                        onChange={handleInputChange}
                        placeholder="SEO Description"
                        className="min-h-20"
                      />
                    </div>

                    {/* Page Configuration */}
                    <div className="space-y-4">
                      <Textarea
                        name="page_content"
                        value={form_data.page_content || ""}
                        onChange={handleInputChange}
                        placeholder="Page Configuration (JSON string)"
                        className="min-h-20"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={is_submitting}>
                        {is_submitting ? "Creating..." : "Create Page"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title & URL</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[200px]">Metadata</TableHead>
                  <TableHead className="w-[150px]">Configuration</TableHead>
                  <TableHead className="w-[100px]">Last Updated</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-32"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-medium">No pages available</div>
                        <div className="text-sm text-muted-foreground">
                          Create your first page to get started
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{page.page_title}</div>
                          <div className="text-sm text-muted-foreground">
                            /{page.page_url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.page_status === "published"
                              ? "bg-green-100 text-green-800"
                              : page.page_status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {page.page_status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="max-w-[200px] space-y-1">
                                <div className="text-sm font-medium truncate">
                                  {page.page_metadata_title || page.page_title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {page.page_metadata_description || "No description"}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-2">
                                <p className="font-medium">SEO Metadata</p>
                                <p>Title: {page.page_metadata_title || page.page_title}</p>
                                <p>Description: {page.page_metadata_description || "No description"}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-sm text-muted-foreground">
                                {page.page_content ? "Hover to view configuration" : "No configuration"}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <pre className="text-xs whitespace-pre-wrap max-w-[300px] max-h-[200px] overflow-y-auto">
                                {page.page_content
                                  ? JSON.stringify(page.page_content, null, 2) // 2 spaces for indentation
                                  : "No configuration"}
                              </pre>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {moment(page.created_at).fromNow() || Date.now()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => window.open(`/${page.page_url}`, "_blank")}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View page
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit page
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete page
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}