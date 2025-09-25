
import { useState, startTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminHeader from "@/components/admin-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  Save,
  Palette
} from "lucide-react";

type FAQCategory = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const iconOptions = [
  { value: "HelpCircle", label: "Help Circle" },
  { value: "User", label: "User" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "MessageSquare", label: "Message" },
  { value: "FileText", label: "File" },
  { value: "Shield", label: "Shield" },
  { value: "Settings", label: "Settings" },
  { value: "Star", label: "Star" },
  { value: "Zap", label: "Zap" },
  { value: "Heart", label: "Heart" }
];

const colorOptions = [
  { value: "bg-blue-100 text-blue-800", label: "Blue", preview: "bg-blue-100" },
  { value: "bg-green-100 text-green-800", label: "Green", preview: "bg-green-100" },
  { value: "bg-purple-100 text-purple-800", label: "Purple", preview: "bg-purple-100" },
  { value: "bg-orange-100 text-orange-800", label: "Orange", preview: "bg-orange-100" },
  { value: "bg-gray-100 text-gray-800", label: "Gray", preview: "bg-gray-100" },
  { value: "bg-indigo-100 text-indigo-800", label: "Indigo", preview: "bg-indigo-100" },
  { value: "bg-red-100 text-red-800", label: "Red", preview: "bg-red-100" },
  { value: "bg-yellow-100 text-yellow-800", label: "Yellow", preview: "bg-yellow-100" }
];

export default function AdminFAQCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);

  const { data: categories = [], isLoading } = useQuery<FAQCategory[]>({
    queryKey: ['/api/admin/faq-categories'],
    enabled: !!user && user.role === 'admin'
  });

  const createMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return apiRequest('/api/admin/faq-categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    },
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
        toast({ title: "FAQ category created successfully" });
        setIsCreateModalOpen(false);
      });
    },
    onError: (error: any) => {
      toast({ title: "Error creating FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: any) => {
      return apiRequest(`/api/admin/faq-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
    },
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
        toast({ title: "FAQ category updated successfully" });
        setIsEditModalOpen(false);
        setEditingCategory(null);
      });
    },
    onError: (error: any) => {
      toast({ title: "Error updating FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/faq-categories/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
        toast({ title: "FAQ category deleted successfully" });
      });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const CategoryForm = ({ category, onSubmit, isEditing = false }: { category?: FAQCategory, onSubmit: (data: any) => void, isEditing?: boolean }) => {
    const [formData, setFormData] = useState({
      name: category?.name || "",
      description: category?.description || "",
      icon: category?.icon || "HelpCircle",
      color: category?.color || "bg-blue-100 text-blue-800",
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      startTransition(() => {
        onSubmit({
          ...formData,
          ...(isEditing && { id: category?.id })
        });
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter category name"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter category description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="color">Color Theme</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color.preview}`}></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? "Update Category" : "Create Category"}
        </Button>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="faq-categories" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading FAQ categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <AdminHeader currentPage="faq-categories" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Tag className="mr-3 h-8 w-8 text-blue-600" />
                FAQ Categories
              </h1>
              <p className="text-gray-600">Manage categories for organizing FAQs</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New FAQ Category</DialogTitle>
                </DialogHeader>
                <CategoryForm onSubmit={(data) => createMutation.mutate(data)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first FAQ category.</p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                        {!category.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Icon: {category.icon}</span>
                        <span>Sort Order: {category.sortOrder}</span>
                        <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this category?')) {
                            deleteMutation.mutate(category.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit FAQ Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm 
                category={editingCategory} 
                onSubmit={(data) => updateMutation.mutate(data)} 
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
