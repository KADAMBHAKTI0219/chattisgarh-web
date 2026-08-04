// Legacy & Central API barrel file re-exporting all modular services
import { fetchApi } from "./client";
import { authService } from "./auth";
import { userService } from "./user";
import { creatorService } from "./creator";
import { categoryService } from "./category";
import { applicationService } from "./application";
import { juryService } from "./jury";
import { votingService } from "./voting";
import { notificationService } from "./notification";
import { newsService } from "./news";
import { galleryService } from "./gallery";
import { cmsService } from "./cms";
import { certificateService } from "./certificate";
import { dashboardService } from "./dashboard";
import { reportService } from "./report";
import { contactService } from "./contact";
import { otpService } from "./otp";
import { participantService } from "./participant";

export {
  fetchApi,
  authService,
  userService,
  creatorService,
  categoryService,
  applicationService,
  juryService,
  votingService,
  notificationService,
  newsService,
  galleryService,
  cmsService,
  certificateService,
  dashboardService,
  reportService,
  contactService,
  otpService,
  participantService,
};

export const sendOtp = otpService.sendOtp;
export const verifyOtp = otpService.verifyOtp;

export default {
  fetchApi,
  auth: authService,
  user: userService,
  creator: creatorService,
  category: categoryService,
  application: applicationService,
  jury: juryService,
  voting: votingService,
  notification: notificationService,
  news: newsService,
  gallery: galleryService,
  cms: cmsService,
  certificate: certificateService,
  dashboard: dashboardService,
  report: reportService,
  contact: contactService,
  otp: otpService,
  participant: participantService,
};
