import {createBrowserRouter} from "react-router";
import {LandingPage} from "./shared/pages/lading-page";
import {SignUpPage} from "./features/authentication/pages/sign-up-page";
import App from "./app.tsx";
import {LoginPage} from "./features/authentication/pages/login-page";
import {ProtectedRoute} from "./shared/components/routing/protected-route";
import {HomePage} from "./shared/pages/home-page";
import {UnprotectedRoute} from "./shared/components/routing/unprotected-route";
import {SignUp} from "./features/authentication/components/sign-up";
import {Login} from "./features/authentication/components/login";
import {MyFilesPage} from "./features/file-storage/pages/my-files-page";
import {TaskPage} from "./features/tasks/pages/tasks-page.tsx";
import {CreateTaskPage} from "./features/tasks/pages/create-task-page";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, element: <UnprotectedRoute><LandingPage /></UnprotectedRoute> },
            { path: "sign-up", element: <UnprotectedRoute><SignUp /></UnprotectedRoute> },
            { path: "login", element: <UnprotectedRoute><Login /></UnprotectedRoute> },
            { path: 'home', element: (<ProtectedRoute><HomePage /></ProtectedRoute>) },
            { path: 'files', element: (<ProtectedRoute><MyFilesPage /></ProtectedRoute>) },
            { path: 'tasks', element: (<ProtectedRoute><TaskPage /></ProtectedRoute>) },
            { path: 'task/new', element: (<ProtectedRoute><CreateTaskPage /></ProtectedRoute>) }
        ],
    },
]);