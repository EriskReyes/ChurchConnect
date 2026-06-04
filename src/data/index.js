const members = [
  { id: 1, name: "Eleanor Hughes", role: "Member", ministry: "Worship", email: "eleanor.h@example.com", phone: "(503) 555-0142", joined: "2019-03-12", status: "Active", giving: 2400, group: "Choir" },
  { id: 2, name: "Marcus Bell", role: "Ministry Leader", ministry: "Youth", email: "marcus.bell@example.com", phone: "(503) 555-0188", joined: "2016-08-01", status: "Active", giving: 5200, group: "Leadership" },
  { id: 3, name: "Priya Nair", role: "Member", ministry: "Outreach", email: "priya.nair@example.com", phone: "(503) 555-0119", joined: "2021-11-20", status: "Active", giving: 1800, group: "Volunteers" },
  { id: 4, name: "David Okafor", role: "Treasurer", ministry: "Finance", email: "d.okafor@example.com", phone: "(503) 555-0177", joined: "2014-01-15", status: "Active", giving: 6800, group: "Leadership" },
  { id: 5, name: "Sofia Reyes", role: "Member", ministry: "Children", email: "sofia.r@example.com", phone: "(503) 555-0155", joined: "2022-06-30", status: "Active", giving: 950, group: "Sunday School" },
  { id: 6, name: "James Whitfield", role: "Pastor", ministry: "Pastoral", email: "pastor.james@example.com", phone: "(503) 555-0100", joined: "2011-09-05", status: "Active", giving: 4000, group: "Leadership" },
  { id: 7, name: "Grace Lin", role: "Member", ministry: "Worship", email: "grace.lin@example.com", phone: "(503) 555-0133", joined: "2020-02-14", status: "Active", giving: 3100, group: "Choir" },
  { id: 8, name: "Tobias Andersen", role: "Member", ministry: "Hospitality", email: "tobias.a@example.com", phone: "(503) 555-0166", joined: "2023-04-02", status: "New", giving: 400, group: "Greeters" },
  { id: 9, name: "Amara Diallo", role: "Ministry Leader", ministry: "Outreach", email: "amara.d@example.com", phone: "(503) 555-0144", joined: "2018-07-19", status: "Active", giving: 4600, group: "Leadership" },
  { id: 10, name: "Henry Caldwell", role: "Member", ministry: "Men's Fellowship", email: "henry.c@example.com", phone: "(503) 555-0122", joined: "2017-10-08", status: "Inactive", giving: 1200, group: "Small Groups" },
  { id: 11, name: "Naomi Brooks", role: "Member", ministry: "Children", email: "naomi.b@example.com", phone: "(503) 555-0111", joined: "2024-01-21", status: "New", giving: 300, group: "Sunday School" },
  { id: 12, name: "Samuel Ortiz", role: "Member", ministry: "Worship", email: "samuel.o@example.com", phone: "(503) 555-0199", joined: "2015-05-17", status: "Active", giving: 2750, group: "Band" },
];

const baptStatus = ["Baptized", "Baptized", "Not yet", "Baptized", "Baptized", "Baptized", "Baptized", "New believer", "Baptized", "Baptized", "Not yet", "Baptized"];
const lastActives = ["2h ago", "Today", "Yesterday", "Today", "3d ago", "1h ago", "Today", "1w ago", "Yesterday", "2w ago", "4d ago", "Today"];
members.forEach((m, i) => { m.baptized = baptStatus[i % baptStatus.length]; m.lastActive = lastActives[i % lastActives.length]; });

const events = [
  { id: 1, title: "Sunday Worship Service", date: "2026-06-07", time: "10:00 AM", location: "Main Sanctuary", ministry: "Worship", attendees: 320, capacity: 400, status: "Upcoming", recurring: true, lead: "James Whitfield" },
  { id: 2, title: "Youth Group — Game Night", date: "2026-06-06", time: "6:30 PM", location: "Fellowship Hall", ministry: "Youth", attendees: 48, capacity: 60, status: "Upcoming", recurring: true, lead: "Marcus Bell" },
  { id: 3, title: "Community Food Drive", date: "2026-06-13", time: "9:00 AM", location: "Parking Lot", ministry: "Outreach", attendees: 75, capacity: 120, status: "Upcoming", recurring: false, lead: "Amara Diallo" },
  { id: 4, title: "Midweek Bible Study", date: "2026-06-10", time: "7:00 PM", location: "Room 204", ministry: "Discipleship", attendees: 32, capacity: 40, status: "Upcoming", recurring: true, lead: "James Whitfield" },
  { id: 5, title: "Children's VBS Planning", date: "2026-06-09", time: "5:00 PM", location: "Room 110", ministry: "Children", attendees: 12, capacity: 15, status: "Upcoming", recurring: false, lead: "Sofia Reyes" },
  { id: 6, title: "Worship Team Rehearsal", date: "2026-06-05", time: "7:30 PM", location: "Sanctuary", ministry: "Worship", attendees: 14, capacity: 20, status: "Upcoming", recurring: true, lead: "Grace Lin" },
  { id: 7, title: "Baptism Sunday", date: "2026-06-21", time: "10:00 AM", location: "Main Sanctuary", ministry: "Pastoral", attendees: 8, capacity: 12, status: "Planning", recurring: false, lead: "James Whitfield" },
  { id: 8, title: "Men's Breakfast Fellowship", date: "2026-05-31", time: "8:00 AM", location: "Fellowship Hall", ministry: "Men's Fellowship", attendees: 40, capacity: 50, status: "Past", recurring: true, lead: "Henry Caldwell" },
];

const ministries = [
  { id: 1, name: "Worship & Music", lead: "Grace Lin", members: 28, color: "#3B5BA5", desc: "Leading the congregation in praise through music and song.", meeting: "Thu 7:30 PM" },
  { id: 2, name: "Youth Ministry", lead: "Marcus Bell", members: 54, color: "#6E9B7E", desc: "Discipling teens through fellowship, study, and service.", meeting: "Fri 6:30 PM" },
  { id: 3, name: "Outreach & Missions", lead: "Amara Diallo", members: 41, color: "#B5742E", desc: "Serving the wider community and supporting global missions.", meeting: "Sat 9:00 AM" },
  { id: 4, name: "Children's Ministry", lead: "Sofia Reyes", members: 36, color: "#7A4E9E", desc: "Nurturing the faith of our youngest members.", meeting: "Sun 9:00 AM" },
  { id: 5, name: "Hospitality", lead: "Tobias Andersen", members: 22, color: "#1F4E5F", desc: "Welcoming guests and creating a place of belonging.", meeting: "Sun 8:30 AM" },
  { id: 6, name: "Discipleship", lead: "James Whitfield", members: 33, color: "#C25B62", desc: "Growing deeper through Bible study and small groups.", meeting: "Wed 7:00 PM" },
];

const donations = [
  { id: 1, donor: "Eleanor Hughes", fund: "General Tithe", amount: 350, date: "2026-06-01", method: "Card", recurring: true },
  { id: 2, donor: "David Okafor", fund: "Building Fund", amount: 1000, date: "2026-06-01", method: "Bank", recurring: true },
  { id: 3, donor: "Anonymous", fund: "Missions", amount: 250, date: "2026-05-31", method: "Cash", recurring: false },
  { id: 4, donor: "Marcus Bell", fund: "General Tithe", amount: 500, date: "2026-05-31", method: "Card", recurring: true },
  { id: 5, donor: "Grace Lin", fund: "Benevolence", amount: 120, date: "2026-05-30", method: "Card", recurring: false },
  { id: 6, donor: "Amara Diallo", fund: "Missions", amount: 400, date: "2026-05-29", method: "Bank", recurring: true },
  { id: 7, donor: "Priya Nair", fund: "General Tithe", amount: 180, date: "2026-05-28", method: "Card", recurring: true },
  { id: 8, donor: "Samuel Ortiz", fund: "Building Fund", amount: 275, date: "2026-05-27", method: "Check", recurring: false },
  { id: 9, donor: "Anonymous", fund: "General Tithe", amount: 60, date: "2026-05-26", method: "Cash", recurring: false },
  { id: 10, donor: "Henry Caldwell", fund: "Benevolence", amount: 200, date: "2026-05-25", method: "Card", recurring: false },
];

const funds = [
  { name: "General Tithe", raised: 184200, goal: 240000, tone: "primary" },
  { name: "Building Fund", raised: 96400, goal: 150000, tone: "sage" },
  { name: "Missions", raised: 38900, goal: 50000, tone: "warn" },
  { name: "Benevolence", raised: 12600, goal: 20000, tone: "primary" },
];

const givingTrend = [
  { m: "Jan", v: 28400 }, { m: "Feb", v: 31200 }, { m: "Mar", v: 29800 },
  { m: "Apr", v: 34600 }, { m: "May", v: 38200 }, { m: "Jun", v: 21900 },
];
const attendanceTrend = [
  { m: "Jan", v: 290 }, { m: "Feb", v: 310 }, { m: "Mar", v: 305 },
  { m: "Apr", v: 332 }, { m: "May", v: 348 }, { m: "Jun", v: 360 },
];

const sermons = [
  { id: 1, title: "The Quiet Strength of Hope", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-31", duration: "38 min", scripture: "Romans 5:1–5", plays: 412, tags: ["Hope", "Faith"] },
  { id: 2, title: "Loving Our Neighbors Well", speaker: "Amara Diallo", series: "On Mission", date: "2026-05-24", duration: "32 min", scripture: "Luke 10:25–37", plays: 356, tags: ["Service", "Love"] },
  { id: 3, title: "Rest for the Weary Soul", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-17", duration: "41 min", scripture: "Matthew 11:28–30", plays: 521, tags: ["Rest", "Peace"] },
  { id: 4, title: "A Generous Life", speaker: "David Okafor", series: "Stewardship", date: "2026-05-10", duration: "29 min", scripture: "2 Corinthians 9:6–8", plays: 287, tags: ["Giving"] },
  { id: 5, title: "When the Storm Comes", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-03", duration: "44 min", scripture: "Mark 4:35–41", plays: 634, tags: ["Faith", "Trust"] },
  { id: 6, title: "The Welcome of Grace", speaker: "Marcus Bell", series: "On Mission", date: "2026-04-26", duration: "27 min", scripture: "Luke 15:11–32", plays: 298, tags: ["Grace"] },
];

const prayers = [
  { id: 1, by: "Eleanor Hughes", time: "2h ago", text: "Please pray for my mother's recovery after her surgery this week.", category: "Health", prayers: 24, answered: false, urgent: true },
  { id: 2, by: "Anonymous", time: "5h ago", text: "Seeking wisdom and peace about a big career decision ahead.", category: "Guidance", prayers: 12, answered: false, urgent: false },
  { id: 3, by: "Sofia Reyes", time: "1d ago", text: "Thankful — our family welcomed a healthy baby girl! Praise God.", category: "Praise", prayers: 58, answered: true, urgent: false },
  { id: 4, by: "Henry Caldwell", time: "1d ago", text: "Pray for the food drive Saturday, that we'd reach families in need.", category: "Outreach", prayers: 19, answered: false, urgent: false },
  { id: 5, by: "Grace Lin", time: "2d ago", text: "For our youth as they prepare for summer camp — safety and growth.", category: "Youth", prayers: 31, answered: false, urgent: false },
];

const posts = [
  { id: 1, by: "Marcus Bell", role: "Youth Leader", time: "1h ago", text: "Huge thanks to everyone who came out to game night! 48 students and not a single quiet moment. Next week: outdoor movie under the stars 🌟", likes: 42, comments: 9, pinned: false, img: true },
  { id: 2, by: "Pastor James Whitfield", role: "Lead Pastor", time: "4h ago", text: "Reminder: Baptism Sunday is June 21st. If you've been considering taking this step, reach out to me or any of our pastors — we'd love to walk with you.", likes: 86, comments: 14, pinned: true, img: false },
  { id: 3, by: "Amara Diallo", role: "Outreach Lead", time: "1d ago", text: "Our food drive needs 10 more volunteers for Saturday morning. Sign up at the welcome desk or in the app. Many hands make light work!", likes: 37, comments: 6, pinned: false, img: false },
];

const chats = [
  { id: 1, name: "Leadership Team", last: "David: I'll have the May report ready by Friday.", time: "9:41 AM", unread: 2, group: true, members: 6 },
  { id: 2, name: "Worship Team", last: "Grace: Set list for Sunday is posted 🎵", time: "8:12 AM", unread: 0, group: true, members: 14 },
  { id: 3, name: "Marcus Bell", last: "Thanks for covering youth group!", time: "Yesterday", unread: 0, group: false },
  { id: 4, name: "Outreach Volunteers", last: "Amara: See everyone Saturday at 9.", time: "Yesterday", unread: 5, group: true, members: 22 },
  { id: 5, name: "Sofia Reyes", last: "Can you send the VBS schedule?", time: "Mon", unread: 0, group: false },
];

const chatThread = [
  { from: "David Okafor", me: false, text: "Morning team — quick update on the building fund.", time: "9:30 AM" },
  { from: "David Okafor", me: false, text: "We crossed $96k this month, about 64% of goal. 🙏", time: "9:31 AM" },
  { from: "me", me: true, text: "That's wonderful news. Can we share it in Sunday's announcements?", time: "9:38 AM" },
  { from: "David Okafor", me: false, text: "Absolutely. I'll have the May report ready by Friday.", time: "9:41 AM" },
];

const documents = [
  { id: 1, name: "2026 Annual Budget.pdf", type: "Finance", size: "1.2 MB", by: "David Okafor", date: "2026-05-20", access: "Leadership" },
  { id: 2, name: "Volunteer Handbook.pdf", type: "Policy", size: "840 KB", by: "Admin", date: "2026-04-11", access: "All" },
  { id: 3, name: "Membership Directory.xlsx", type: "Members", size: "320 KB", by: "Admin", date: "2026-05-30", access: "Leadership" },
  { id: 4, name: "VBS 2026 Curriculum.zip", type: "Children", size: "14 MB", by: "Sofia Reyes", date: "2026-05-18", access: "Ministry" },
  { id: 5, name: "Facility Use Agreement.docx", type: "Policy", size: "120 KB", by: "Admin", date: "2026-03-02", access: "All" },
];

const tasks = [
  { id: 1, text: "Approve June worship set list", done: false, due: "Today" },
  { id: 2, text: "Review baptism candidate list", done: false, due: "Tomorrow" },
  { id: 3, text: "Sign off on May financial report", done: false, due: "Fri" },
  { id: 4, text: "Confirm guest speaker for July", done: true, due: "Done" },
];

const DB = { members, events, ministries, donations, funds, givingTrend, attendanceTrend, sermons, prayers, posts, chats, chatThread, documents, tasks };

export { members, events, ministries, donations, funds, givingTrend, attendanceTrend, sermons, prayers, posts, chats, chatThread, documents, tasks };
export default DB;
