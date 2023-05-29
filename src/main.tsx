import "bootstrap/dist/css/bootstrap.css"
import "./index.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ErrorBoundary from "./routes/error-boundary"
import { ROUTE_PATHS } from "./lib/shared-constants"
import Layout from "./routes/layout"
import Auth from "./routes/auth"
import Dashboard from "./routes/dashboard"
import Booking from "./routes/booking"

const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.ROOT,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ROUTE_PATHS.ROOT,
        element: <Auth />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: ROUTE_PATHS.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTE_PATHS.BOOKING,
            element: <Booking />,
          },
        ],
      },
    ],
  },
])

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
