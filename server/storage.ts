import {
  type User,
  type InsertUser,
  type Finder,
  type InsertFinder,
  type Find,
  type InsertFind,
  type Proposal,
  type InsertProposal,
  type Contract,
  type InsertContract,
  type Review,
  type InsertReview,
  type Findertoken,
  type InsertFindertoken,
  type Transaction,
  type InsertTransaction,
  type AdminSetting,
  type InsertAdminSetting,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Category,
  type InsertCategory,
  type WithdrawalRequest,
  type InsertWithdrawalRequest,
  type BlogPost,
  type InsertBlogPost,
  type OrderSubmission,
  type InsertOrderSubmission,
  type FinderLevel,
  type InsertFinderLevel,
  type MonthlyTokenDistribution,
  type InsertMonthlyTokenDistribution,
  type TokenGrant,
  type InsertTokenGrant,
  type Strike,
  type InsertStrike,
  type UserRestriction,
  type InsertUserRestriction,
  type Dispute,
  type InsertDispute,
  type BehavioralTraining,
  type InsertBehavioralTraining,
  type TrustedBadge,
  type InsertTrustedBadge,
  type RestrictedWord,
  type InsertRestrictedWord,
  type TokenPackage,
  type InsertTokenPackage,
  type ClientTokenGrant,
  type InsertClientTokenGrant,
  users,
  finders,
  finds,
  proposals,
  contracts,
  reviews,
  findertokens,
  transactions,
  adminSettings,
  conversations,
  messages,
  categories,
  withdrawalSettings,
  withdrawalRequests,
  blogPosts,
  orderSubmissions,
  finderLevels,
  tokenCharges,
  monthlyTokenDistributions,
  tokenGrants,
  clientTokenGrants,
  restrictedWords,
  strikes,
  userRestrictions,
  disputes,
  behavioralTraining,
  trustedBadges,
  tokenPackages,
  supportAgents,
  supportTickets,
  supportTicketMessages,
  supportDepartments,
  contactSettings,
  faqCategories,
  userVerifications,
  type SupportAgent,
  type SupportTicket,
  type SupportTicketMessage,
  type SupportDepartment,
  type InsertSupportAgent,
  type InsertSupportTicket,
  type InsertSupportDepartment,
  type UserVerification,
  type InsertUserVerification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, asc } from "drizzle-orm";
import { generateId } from "@shared/utils";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;

  // Finder operations
  getFinder(id: string): Promise<Finder | undefined>;
  getFinderByUserId(userId: string): Promise<Finder | undefined>;
  createFinder(finder: InsertFinder): Promise<Finder>;
  updateFinder(id: string, updates: Partial<Finder>): Promise<Finder | undefined>;
  getFinderPendingEarnings(finderId: string): Promise<{ pendingAmount: number; contractCount: number; }>;
  calculateFinderProfileCompletion(finderId: string): Promise<{ completionPercentage: number; missingFields: string[]; }>;

  // Find operations
  getFind(id: string): Promise<Find | undefined>;
  getFindsByClientId(clientId: string): Promise<Find[]>;
  getAllActiveFinds(): Promise<Find[]>;
  getAllFinds(): Promise<Find[]>;
  getAvailableFindsForFinders(): Promise<Find[]>;
  createFind(find: InsertFind): Promise<Find>;
  updateFind(id: string, updates: Partial<Find>): Promise<Find | undefined>;

  // Proposal operations
  getProposal(id: string): Promise<Proposal | undefined>;
  getProposalsByFindId(findId: string): Promise<Proposal[]>;
  getProposalsByFinderId(finderId: string): Promise<Proposal[]>;
  getAllProposals(): Promise<Proposal[]>;
  getProposalByFinderAndFind(finderId: string, findId: string): Promise<Proposal | undefined>;
  hasAcceptedProposal(findId: string): Promise<boolean>;
  getClientContactForAcceptedProposal(proposalId: string, finderId: string): Promise<{firstName: string, lastName: string, email: string, phone?: string} | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Contract operations
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByClientId(clientId: string): Promise<Contract[]>;
  getContractsByFinderId(finderId: string): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, updates: Partial<Contract>): Promise<Contract | undefined>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByFinderId(finderId: string): Promise<Review[]>;

  // Findertoken operations
  getFindertokenBalance(finderId: string): Promise<Findertoken | undefined>;
  createFindertokenRecord(finderId: string): Promise<Findertoken>;
  updateFindertokenBalance(finderId: string, newBalance: number): Promise<Findertoken | undefined>;
  updateFinderTokenBalance(finderId: string, newBalance: number): Promise<void>;
  syncFinderTokenBalances(): Promise<void>;

  // Transaction operations
  createTransaction(transaction: any): Promise<Transaction>;
  getTransactionsByFinderId(finderId: string): Promise<Transaction[]>;
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getTransactionByReference(reference: string): Promise<Transaction | undefined>;
  getAllTransactionsWithUsers(): Promise<any[]>;
  getAllContractsWithUsers(): Promise<any[]>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  getAdminSettings(): Promise<{[key: string]: string}>;
  setAdminSetting(key: string, value: string): Promise<AdminSetting>;

  // Client operations
  getClientProfile(clientId: string): Promise<User | undefined>;
  deductClientFindertokens(clientId: string, amount: number, description: string): Promise<void>;
  addClientFindertokens(clientId: string, amount: number, description: string): Promise<{ success: boolean; newBalance: number; }>;

  // Token charging
  chargeFinderTokens(finderId: string, amount: number, reason: string, chargedBy: string): Promise<boolean>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getActiveCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  // User management operations
  banUser(userId: string, reason: string): Promise<User | undefined>;
  unbanUser(userId: string): Promise<User | undefined>;
  verifyUser(userId: string): Promise<User | undefined>;
  unverifyUser(userId: string): Promise<User | undefined>;
  verifyFinder(finderId: string): Promise<Finder | null>;
  unverifyFinder(finderId: string): Promise<Finder | null>;

  // Withdrawal operations
  createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest>;
  getWithdrawalRequests(): Promise<any[]>;
  updateWithdrawalRequest(id: string, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined>;
  updateFinderBalance(finderId: string, amount: string): Promise<void>;
  releaseFundsToFinder(finderId: string, contractAmount: string): Promise<void>;
  getWithdrawalSettings(finderId: string): Promise<any>;
  updateWithdrawalSettings(finderId: string, settings: any): Promise<any>;
  getWithdrawalsByFinderId(finderId: string): Promise<WithdrawalRequest[]>;

  // Messaging operations
  getConversation(clientId: string, proposalId: string): Promise<Conversation | undefined>;
  getConversationById(conversationId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsByClientId(clientId: string): Promise<Array<Conversation & {
    proposal: { request: { title: string; }; };
    finder: { user: { firstName: string; lastName: string; }; };
    lastMessage?: { content: string; createdAt: Date; senderId: string; };
    unreadCount: number;
  }>>;
  getConversationsByFinderId(finderId: string): Promise<Array<Conversation & {
    proposal: { request: { title: string; }; };
    client: { firstName: string; lastName: string; };
    lastMessage?: { content: string; createdAt: Date; senderId: string; };
    unreadCount: number;
  }>>;
  getMessages(conversationId: string): Promise<Array<Message & { sender: { firstName: string; lastName: string; }; quotedMessage?: { content: string; sender: { firstName: string; lastName: string; } } }>>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  getFinderProfile(finderId: string): Promise<any>;

  // Blog post operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Order submission operations
  createOrderSubmission(submission: InsertOrderSubmission): Promise<OrderSubmission>;
  getOrderSubmissionByContractId(contractId: string): Promise<OrderSubmission | undefined>;
  updateOrderSubmission(id: string, updates: Partial<OrderSubmission>): Promise<OrderSubmission | undefined>;
  getContractWithSubmission(contractId: string): Promise<(Contract & {orderSubmission?: OrderSubmission, finder?: any}) | undefined>;

  // Finder level operations
  getFinderLevels(): Promise<FinderLevel[]>;
  getFinderLevel(id: string): Promise<FinderLevel | undefined>;
  createFinderLevel(level: InsertFinderLevel): Promise<FinderLevel>;
  updateFinderLevel(id: string, updates: Partial<FinderLevel>): Promise<FinderLevel | undefined>;
  deleteFinderLevel(id: string): Promise<boolean>;
  calculateFinderLevel(finderId: string): Promise<FinderLevel | undefined>;
  assignFinderLevel(finderId: string, levelId: string): Promise<void>;

  // Monthly token distribution operations
  distributeMonthlyTokens(): Promise<{ distributed: number; alreadyDistributed: number; }>;
  getMonthlyDistributions(month: number, year: number): Promise<MonthlyTokenDistribution[]>;
  hasReceivedMonthlyTokens(finderId: string, month: number, year: number): Promise<boolean>;
  createMonthlyDistribution(distribution: InsertMonthlyTokenDistribution): Promise<MonthlyTokenDistribution>;

  // Token grant operations
  grantTokensToFinder(finderId: string, amount: number, reason: string, grantedBy: string): Promise<TokenGrant>;
  grantTokensToClient(userId: string, amount: number, reason: string, grantedBy: string): Promise<ClientTokenGrant>;
  getTokenGrants(userId?: string): Promise<any[]>;
  getAllFindersForTokens(): Promise<Finder[]>;

  // Strike System operations
  issueStrike(strike: InsertStrike): Promise<Strike>;
  getStrikesByUserId(userId: string): Promise<Strike[]>;
  getActiveStrikesCount(userId: string): Promise<number>;
  updateStrike(id: string, updates: Partial<Strike>): Promise<Strike | undefined>;

  // User Restrictions operations
  createUserRestriction(restriction: InsertUserRestriction): Promise<UserRestriction>;
  getUserActiveRestrictions(userId: string): Promise<UserRestriction[]>;
  updateUserRestriction(id: string, updates: Partial<UserRestriction>): Promise<UserRestriction | undefined>;

  // Dispute operations
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  getDisputesByUserId(userId: string): Promise<Dispute[]>;
  getAllDisputes(): Promise<Dispute[]>;
  updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute | undefined>;

  // Behavioral Training operations
  assignTraining(training: InsertBehavioralTraining): Promise<BehavioralTraining>;
  getTrainingsByUserId(userId: string): Promise<BehavioralTraining[]>;
  updateTraining(id: string, updates: Partial<BehavioralTraining>): Promise<BehavioralTraining | undefined>;

  // Trusted Badge operations
  awardBadge(badge: InsertTrustedBadge): Promise<TrustedBadge>;
  getUserBadges(userId: string): Promise<TrustedBadge[]>;
  updateBadge(id: string, updates: Partial<TrustedBadge>): Promise<TrustedBadge | undefined>;

  // Strike System Analysis
  getUserStrikeLevel(userId: string): Promise<number>;

  // Token Package operations
  getAllTokenPackages(): Promise<TokenPackage[]>;
  getActiveTokenPackages(): Promise<TokenPackage[]>;
  getTokenPackage(id: string): Promise<TokenPackage | undefined>;
  createTokenPackage(tokenPackage: InsertTokenPackage): Promise<TokenPackage>;
  updateTokenPackage(id: string, updates: Partial<TokenPackage>): Promise<TokenPackage | undefined>;
  deleteTokenPackage(id: string): Promise<boolean>;

  // Restricted Words Management
  addRestrictedWord(word: InsertRestrictedWord): Promise<RestrictedWord>;
  getRestrictedWords(): Promise<RestrictedWord[]>;
  removeRestrictedWord(id: string): Promise<boolean>;
  updateRestrictedWord(id: string, updates: Partial<RestrictedWord>): Promise<RestrictedWord | undefined>;
  checkContentForRestrictedWords(content: string): Promise<string[]>;

  // Support Agent Management
  createSupportAgent(data: InsertSupportAgent & { agentId: string }): Promise<SupportAgent>;
  getSupportAgents(): Promise<Array<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } }>>;
  getSupportAgent(id: string): Promise<SupportAgent & { user: { id: string; firstName: string; lastName: string; email: string; } } | undefined>;
  updateSupportAgent(id: string, data: Partial<InsertSupportAgent>): Promise<SupportAgent | undefined>;
  suspendSupportAgent(id: string, reason: string): Promise<SupportAgent | undefined>;
  reactivateSupportAgent(id: string): Promise<SupportAgent | undefined>;
  deleteSupportAgent(id: string): Promise<boolean>;
  generateAgentId(): Promise<string>;

  // Support Department Management
  getSupportDepartments(): Promise<Array<SupportDepartment & { isActive: boolean; name: string; }>>;
  createSupportDepartment(data: InsertSupportDepartment): Promise<SupportDepartment>;
  updateSupportDepartment(id: string, data: Partial<InsertSupportDepartment>): Promise<SupportDepartment | undefined>;
  deleteSupportDepartment(id: string): Promise<boolean>;

  // Support Agent Check
  getUserSupportAgent(userId: string): Promise<SupportAgent | undefined>;

  // Generate withdrawal request ID
  generateWithdrawalRequestId(): Promise<string>;

  // Contact Settings operations
  getContactSettings(): Promise<any>;
  updateContactSettings(settings: any): Promise<any>;

  // FAQ Categories operations
  getFAQCategories(): Promise<any[]>;
  createFAQCategory(category: any): Promise<any>;
  updateFAQCategory(id: string, updates: any): Promise<any>;
  deleteFAQCategory(id: string): Promise<boolean>;

  // User Verification operations
  submitVerification(verification: any): Promise<any>;
  getVerificationByUserId(userId: string): Promise<any>;
  getPendingVerifications(): Promise<any[]>;
  updateVerificationStatus(id: string, status: string, reviewedBy: string, rejectionReason?: string): Promise<any>;
  getVerificationById(id: string): Promise<any>;
  isVerificationRequired(): Promise<boolean>;

  // Support Ticket operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets(filters?: { status?: string; department?: string; assignedTo?: string; priority?: string }): Promise<Array<SupportTicket & { submitter?: { firstName: string; lastName: string; email: string; }; assignedAgent?: { agentId: string; user: { firstName: string; lastName: string; } }; }>>;
  getSupportTicket(id: string): Promise<SupportTicket & { submitter?: { firstName: string; lastName: string; email: string; }; assignedAgent?: { agentId: string; user: { firstName: string; lastName: string; } }; } | undefined>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: string): Promise<boolean>;
  generateTicketNumber(): Promise<string>;

  // Support Ticket Message operations
  createSupportTicketMessage(message: { ticketId: string; senderId?: string; senderType: string; senderName: string; senderEmail?: string; content: string; attachments?: string[]; isInternal?: boolean; }): Promise<SupportTicketMessage>;
  getSupportTicketMessages(ticketId: string): Promise<Array<SupportTicketMessage & { sender?: { firstName: string; lastName: string; } }>>;
  markTicketMessageAsRead(messageId: string): Promise<void>;
}

export const storage = new DatabaseStorage();