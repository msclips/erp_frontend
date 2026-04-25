# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4792c815-2d0f-40e9-9e6a-bcd4dad63915

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4792c815-2d0f-40e9-9e6a-bcd4dad63915) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the frontend directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

Copy `.env.example` to `.env` and modify the values as needed for your environment.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4792c815-2d0f-40e9-9e6a-bcd4dad63915) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)







File Structure for APIs
1. src/services/api.ts - Define API endpoints
Add your API methods here:


// Add interface for your data
interface YourData {
  id: number;
  name: string;
  // ... other fields
}

// Inside ApiService class, add methods:
async getYourData() {
  return this.request<YourData[]>('/your-endpoint');
}

async createYourData(data: Omit<YourData, 'id'>) {
  return this.request<YourData>('/your-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
2. src/hooks/useApi.ts - Create React Query hooks
Add hooks to manage state and caching:


export function useYourData() {
  return useQuery({
    queryKey: ['yourData'],
    queryFn: () => apiService.getYourData(),
  });
}

export function useCreateYourData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createYourData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yourData'] });
      toast({ title: "Success!" });
    },
  });
}
3. src/pages/YourPage.tsx - Use in components

import { useYourData, useCreateYourData } from '@/hooks/useApi';

const YourPage = () => {
  const { data, isLoading, error } = useYourData();
  const createMutation = useCreateYourData();
  
  // Use data, handle loading/error states
};
🔄 Flow Summary
Define endpoint in api.ts → 2. Create hook in useApi.ts → 3. Use hook in your page/component
🔧 Vite Proxy (for CORS)