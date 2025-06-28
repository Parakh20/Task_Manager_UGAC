
A modern, minimalist, and fully-featured Kanban-style task manager built with Next.js, React, and Tailwind CSS.  
Supports drag-and-drop, calendar integration, dark mode, and more.

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-task-manager.git
   cd your-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features Implemented

- **Modern Kanban Board**
  - Three columns: Todo, In Progress, Done
  - Drag and drop tasks between columns and reorder within a column
  - Neumorphic, floating card design with micro-interactions

- **Task Management**
  - Create, edit, and delete tasks
  - Priority, status, due date, tags, subtasks, attachments, and comments
  - Quick edit via modal
  - Priority and status color-coding

- **Calendar Integration**
  - Full month view calendar page
  - Tasks appear as colored bars on their due dates
  - Click a date to create a task; click a task to edit

- **List View**
  - Minimalist, expandable list of tasks with inline details

- **Filtering & Sorting**
  - Filter tasks by status, priority, due date, tags, and search
  - Sort tasks by due date, priority, or creation date

- **Dark Mode**
  - Fully responsive dark/light theme toggle
  - Accessible color palette

- **Data Persistence**
  - All tasks and settings saved to local storage

- **Import/Export**
  - Export tasks as JSON
  - Import tasks from JSON

- **Minimalist UI**
  - Bento-style columns
  - Pill-style status headers
  - Soft shadows, rounded corners, and smooth transitions

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (drag-and-drop)
- [date-fns](https://date-fns.org/) (date utilities)
- [Lucide Icons](https://lucide.dev/)

## 📁 Project Structure

```
src/
  app/                # Next.js app routes (pages)
  components/         # Reusable UI and task components
  context/            # Task and theme context providers
  types/              # TypeScript types
  utils/              # Utility functions (e.g., localStorage, sorting)
```

## 💡 Customization

- Adjust theme, accent colors, and shadows in `tailwind.config.js`
- Add more columns or features by editing `TaskBoard.tsx` and context

## 📣 Feedback & Contributions

Feel free to open issues or submit pull requests for improvements!

**Enjoy your modern, minimalist task manager!**