import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser,
  faFileLines,
  faHouse,
  faStar,
  faUser,
  faUserTie,
  faUsers,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import DashboardIcon from '@mui/icons-material/Dashboard';

export const SideBarData = [
  {
		title: "Home",
		path: "/",
		role: "ALL",
		icon: <FontAwesomeIcon icon={faHouse} style={{ fontSize: "15px" }} />,
		margin: "0 0 0 2px",
	},
	{
		title: "Dashboard",
		path: "/dashboard",
		role: "ADMIN",
		icon: <DashboardIcon style={{ fontSize: "15px" }} />,
		margin: "0 0 0 2px",
	},
	{
		title: "View Profile",
		path: "/viewProfile",
		role: "EMPLOYEE",
		icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
		margin: "0 0 0 4px",
	},
	{
		title: "Take Evaluation",
		path: "/takeEvaluation",
		role: "EMPLOYEE",
		icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "15px" }} />,
		margin: "0 0 0 4px",
	},
	{
		title: "View Results",
		path: "/viewRatings",
		role: "EMPLOYEE",
		icon: <FontAwesomeIcon icon={faStar} style={{ fontSize: "15px" }} />,
		margin: "0 0 0 1px",
	},
  {
    title: "Manage Account",
    path: "/manageAccount",
    role: ["ADMIN", "SUPERUSER"],
    icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: "15px" }} />,
    margin: "0 0 0 0",
  },
  {
    title: "Manage Offices",
    path: "/manageOffices",
    role: ["ADMIN", "SUPERUSER"],
    icon: (
      <FontAwesomeIcon icon={faBuildingUser} style={{ fontSize: "15px" }} />
    ),
  },
  {
    title: "Manage Employee",
    path: "/manageEmployee",
    role: ["ADMIN", "SUPERUSER"],
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
	
  {
    title: "Activity Logs",
    path: "/activityLogs",
    role: ["ADMIN", "SUPERUSER"],
    icon: <FontAwesomeIcon icon={faListUl} style={{ fontSize: "15px" }} />,
    margin: "0 0 0 5px",
  },
  {
    title: "View Profile",
    path: "/ViewProfileHead",
    role: ["HEAD"],
    icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Staff Evaluation",
    path: "/EvaluateEmployee",
    role: ["HEAD"],
    icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "15px" }} />,
    margin: "0 0 0 4px",
  },

  {
    title: "Track Employee",
    path: "/TrackEmployee",
    role: ["HEAD"],
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
];
