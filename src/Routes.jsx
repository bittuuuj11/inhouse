import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import EventPlanDetails from './pages/event-plan-details';
import BudgetCalculator from './pages/budget-calculator';
import TaskBoardManagement from './pages/task-board-management';
import MarketingMaterials from './pages/marketing-materials';
import EventPlanningDashboard from './pages/event-planning-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<EventPlanningDashboard />} />
        <Route path="/event-plan-details" element={<EventPlanDetails />} />
        <Route path="/budget-calculator" element={<BudgetCalculator />} />
        <Route path="/task-board-management" element={<TaskBoardManagement />} />
        <Route path="/marketing-materials" element={<MarketingMaterials />} />
        <Route path="/event-planning-dashboard" element={<EventPlanningDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
