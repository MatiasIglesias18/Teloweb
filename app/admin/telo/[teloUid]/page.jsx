import { TeloContextProvider } from "@/app/context/TeloDocProvider";
import { TeloViewer } from "./components/TeloViewer";

const TeloOverviewPage = ({ params }) => {
  return (
    <TeloContextProvider>
      <TeloViewer />
    </TeloContextProvider>
  );
};

export default TeloOverviewPage;
