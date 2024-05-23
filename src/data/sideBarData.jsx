import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser,
  faFileLines,
  faHouse,
  faStar,
  faUser,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const SideBarData = [
  {
    title: "Home",
    path: "/",
    role: "ALL",
    icon: <FontAwesomeIcon icon={faHouse} style={{ fontSize: "15px" }} />,
  },
  {
    title: "View Profile",
    path: "/viewProfile",
    roles: "EMPLOYEE",
    icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Take Evaluation",
    path: "/takeEvaluation",
    role: "EMPLOYEE",
    icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "15px" }} />,
  },
  {
    title: "View Ratings",
    path: "/viewRatings",
    role: "EMPLOYEE",
    icon: <FontAwesomeIcon icon={faStar} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Manage Account",
    path: "/manageAccount",
    role: "ADMIN",
    icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Manage Offices",
    path: "/manageOffices",
    role: "ADMIN",
    icon: (
      <FontAwesomeIcon icon={faBuildingUser} style={{ fontSize: "15px" }} />
    ),
  },
  {
    title: "Manage Employee",
    path: "/manageEmployee",
    role: "ADMIN",
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
  {
    title: "View Profile",
    path: "/ViewProfileAdmin",
    role: "HEAD",
    icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Track Employee",
    path: "/TrackEmployee",
    role: "HEAD",
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
];
