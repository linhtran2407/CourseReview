import { instructorMetrics } from "./ReviewMetrics";
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import FolderZipRoundedIcon from '@mui/icons-material/FolderZipRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import BookIcon from '@mui/icons-material/Book';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

import RateReviewIcon from '@mui/icons-material/RateReview';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FontDownloadOutlinedIcon from '@mui/icons-material/FontDownloadOutlined';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import MeetingRoomSharpIcon from '@mui/icons-material/MeetingRoomSharp';


// convert semester to correct format in frontend
// eg: Fall 2021 <- f21, Spring 2023 <- s23
export function shortToLongSemester(semester) {
  if (!semester) return "";
  const season = semester.startsWith("s") ? "Spring" : "Fall";
  const year = semester.slice(1);
  return `${season} 20${year}`;
}

// convert semester to correct format in the DB
// eg: Fall 2021 -> f21, Spring 2023 -> s23
export function longToShortSemester(semester) {
  const [term, year] = semester.split(" ");
  const shortTerm = term.charAt(0).toLowerCase();
  const shortYear = year.slice(-2);
  return `${shortTerm}${shortYear}`;
}

export function fullCourseName(courseTitle, courseNumber, institution) {
  const institutionInitial = institution.slice(0, 1).toUpperCase();
  const title = `${institutionInitial}${courseNumber} - ${courseTitle}`;
  return title;
}

export function instructorNameEmail(name, email) {
  return `${name} - ${email}`;
}

export function showStatus(status) {
  return status === 0
    ? "pending"
    : status === 1
    ? "approved"
    : status === 2
    ? "rejected"
    : "";
}

export function getRatingDescription(rate, field) {
  if (field === "courseQuality" || field === "instructorQuality" || field === "instructorAccess" || field === "overallRating") {
    switch (rate) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "Invalid rating";
    }
  } else if (field === "difficulty") {
    switch (rate) {
      case 1:
        return "Very Easy";
      case 2:
        return "Easy";
      case 3:
        return "Neutral";
      case 4:
        return "Difficult";
      case 5:
        return "Very Difficult";
      default:
        return "Invalid rating";
    }
  } else if (field === "workRequired" || field === "amountLearned" || field === "stimulateInterest") {
    switch (rate) {
      case 1:
        return "Very Little";
      case 2:
        return "Some";
      case 3:
        return "Moderate";
      case 4:
        return "A lot";
      case 5:
        return "A great deal";
      default:
        return "Invalid rating";
    }
  } else {
    switch (rate) {
      case 1:
        return "Very Unlikely";
      case 2:
        return "Unlikely";
      case 3:
        return "Neutral";
      case 4:
        return "Likely";
      case 5:
        return "Very Likely";
      default:
        return "Invalid rating";
    }
  }
}

const getInstructorMetricGroupNameById = (id) => {
  for (const groupName in instructorMetrics) {
    const metrics = instructorMetrics[groupName];
    if (metrics.find(metric => metric.id === id)) {
      return groupName;
    }
  }
  return null;
};


export const getInstructorMetricColor = (id) => {
  const groupName = getInstructorMetricGroupNameById(id);
  if (groupName === "Communication and Engagement") {
    return "rgb(151 227 194)"; // green
  } else if (groupName === "Course Design and Assessment") {
    return "rgb(247 176 173)"; // red
  } else if (groupName === "Grading and Feedback") {
    return "rgb(244 244 148)"; // yellow
  }
};

export const instructorMetricIcon = {
  "clearCommunication": ForumRoundedIcon,
  "responsive": FlashOnRoundedIcon,
  "engaging": Diversity3RoundedIcon,
  "inspiring": AutoAwesomeRoundedIcon,
  "createWelcomingEnv": Diversity2RoundedIcon,
  "accessibleOutsideClass": MeetingRoomRoundedIcon,
  "lectureHeavy": MenuBookRoundedIcon,
  "testHeavy": ModeRoundedIcon,
  "readingHeavy": PersonSearchRoundedIcon,
  "lotsOfHomework": FormatListNumberedRtlRoundedIcon,
  "assignsUsefulProjects": ExtensionRoundedIcon,
  "organized": FolderZipRoundedIcon,
  "giveGoodFeedback": EmojiEventsRoundedIcon,
  "offersExtraCredit": CardGiftcardRoundedIcon,
  "fairGrader": BalanceRoundedIcon,
  "toughGrader": LocalFireDepartmentRoundedIcon,
  "clearGradingCriteria": StraightenRoundedIcon,
};

export const courseMetricIcon = {
  "courseQuality": [BookIcon, BookOutlinedIcon],
  "instructorQuality": [RateReviewIcon, RateReviewOutlinedIcon],
  "difficulty": [HourglassFullIcon, HourglassEmptyIcon],
  "amountLearned": [FontDownloadIcon, FontDownloadOutlinedIcon],
  "workRequired": [BorderColorIcon, BorderColorOutlinedIcon],
  "stimulateInterest": [FavoriteSharpIcon, FavoriteOutlinedIcon],
  "instructorAccess": [MeetingRoomSharpIcon, MeetingRoomOutlinedIcon],
}