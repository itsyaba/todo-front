import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import { AppProvider } from "./contexts/AppContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MainLayout>
          {/* <div className="App">
          </div> */}
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/collections/:id" component={CollectionPage} />
          </Switch>
        </MainLayout>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

// import React from 'react'
// import 'styles/ReactWelcome.css'
// import Header from './components/Header'
// import AuthModal from './components/AuthModal'
// import { useAuth } from './contexts/AuthContext'

// const App = () => {
//   return (
//     <div className='App'>
//       <Header />
//       <LoggedInStatus />
//       <AuthModal />
//     </div>
//   )
// }

// const LoggedInStatus = () => {
//   const { isLoggedIn, account } = useAuth()

//   if (isLoggedIn && !!account) {
//     return <p>Hey, {account.username}! I'm happy to let you know: you are authenticated!</p>
//   }

//   return <p>login</p>
// }

// export default App
