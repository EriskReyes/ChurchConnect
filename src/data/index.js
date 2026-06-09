const members = [
  { id: 1, name: "Eleanor Hughes", role: "Member", ministry: "Worship", email: "eleanor.h@example.com", phone: "(503) 555-0142", joined: "2019-03-12", status: "Active", giving: 2400, group: "Choir", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Marcus Bell", role: "Ministry Leader", ministry: "Youth", email: "marcus.bell@example.com", phone: "(503) 555-0188", joined: "2016-08-01", status: "Active", giving: 5200, group: "Leadership", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Priya Nair", role: "Member", ministry: "Outreach", email: "priya.nair@example.com", phone: "(503) 555-0119", joined: "2021-11-20", status: "Active", giving: 1800, group: "Volunteers", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "David Okafor", role: "Treasurer", ministry: "Finance", email: "d.okafor@example.com", phone: "(503) 555-0177", joined: "2014-01-15", status: "Active", giving: 6800, group: "Leadership", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Sofia Reyes", role: "Member", ministry: "Children", email: "sofia.r@example.com", phone: "(503) 555-0155", joined: "2022-06-30", status: "Active", giving: 950, group: "Sunday School", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "James Whitfield", role: "Pastor", ministry: "Pastoral", email: "pastor.james@example.com", phone: "(503) 555-0100", joined: "2011-09-05", status: "Active", giving: 4000, group: "Leadership", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Grace Lin", role: "Member", ministry: "Worship", email: "grace.lin@example.com", phone: "(503) 555-0133", joined: "2020-02-14", status: "Active", giving: 3100, group: "Choir", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Tobias Andersen", role: "Member", ministry: "Hospitality", email: "tobias.a@example.com", phone: "(503) 555-0166", joined: "2023-04-02", status: "New", giving: 400, group: "Greeters", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 9, name: "Amara Diallo", role: "Ministry Leader", ministry: "Outreach", email: "amara.d@example.com", phone: "(503) 555-0144", joined: "2018-07-19", status: "Active", giving: 4600, group: "Leadership", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 10, name: "Henry Caldwell", role: "Member", ministry: "Men's Fellowship", email: "henry.c@example.com", phone: "(503) 555-0122", joined: "2017-10-08", status: "Inactive", giving: 1200, group: "Small Groups", avatar: "https://i.pravatar.cc/150?img=10" },
  { id: 11, name: "Naomi Brooks", role: "Member", ministry: "Children", email: "naomi.b@example.com", phone: "(503) 555-0111", joined: "2024-01-21", status: "New", giving: 300, group: "Sunday School", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 12, name: "Samuel Ortiz", role: "Member", ministry: "Worship", email: "samuel.o@example.com", phone: "(503) 555-0199", joined: "2015-05-17", status: "Active", giving: 2750, group: "Band", avatar: "https://i.pravatar.cc/150?img=12" },
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
  { id: 1, title: "The Quiet Strength of Hope", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-31", duration: "38 min", scripture: "Romans 5:1–5", plays: 412, tags: ["Hope", "Faith"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Hope.mp3" },
  { id: 2, title: "Loving Our Neighbors Well", speaker: "Amara Diallo", series: "On Mission", date: "2026-05-24", duration: "32 min", scripture: "Luke 10:25–37", plays: 356, tags: ["Service", "Love"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Neighbors.mp3" },
  { id: 3, title: "Rest for the Weary Soul", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-17", duration: "41 min", scripture: "Matthew 11:28–30", plays: 521, tags: ["Rest", "Peace"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Rest.mp3" },
  { id: 4, title: "A Generous Life", speaker: "David Okafor", series: "Stewardship", date: "2026-05-10", duration: "29 min", scripture: "2 Corinthians 9:6–8", plays: 287, tags: ["Giving"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Generous.mp3" },
  { id: 5, title: "When the Storm Comes", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-05-03", duration: "44 min", scripture: "Mark 4:35–41", plays: 634, tags: ["Faith", "Trust"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Storm.mp3" },
  { id: 6, title: "The Welcome of Grace", speaker: "Marcus Bell", series: "On Mission", date: "2026-04-26", duration: "27 min", scripture: "Luke 15:11–32", plays: 298, tags: ["Grace"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Grace.mp3" },
  { id: 7, title: "Building on the Rock", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-04-19", duration: "35 min", scripture: "Matthew 7:24–27", plays: 445, tags: ["Foundation", "Trust"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Rock.mp3" },
  { id: 8, title: "Go and Make Disciples", speaker: "Marcus Bell", series: "On Mission", date: "2026-04-12", duration: "38 min", scripture: "Matthew 28:18–20", plays: 389, tags: ["Mission", "Discipleship"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Disciples.mp3" },
  { id: 9, title: "The Gift of Contentment", speaker: "David Okafor", series: "Stewardship", date: "2026-04-05", duration: "31 min", scripture: "Philippians 4:10–13", plays: 267, tags: ["Contentment", "Stewardship"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Contentment.mp3" },
  { id: 10, title: "Faithful in Small Things", speaker: "Grace Lin", series: "Stewardship", date: "2026-03-29", duration: "34 min", scripture: "Luke 16:10–13", plays: 312, tags: ["Faithfulness", "Integrity"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Faithful.mp3" },
  { id: 11, title: "The Power of Forgiveness", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-03-22", duration: "42 min", scripture: "Colossians 3:12–15", plays: 567, tags: ["Forgiveness", "Healing"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Forgiveness.mp3" },
  { id: 12, title: "Love Without Limits", speaker: "Amara Diallo", series: "On Mission", date: "2026-03-15", duration: "36 min", scripture: "1 Corinthians 13:1–13", plays: 423, tags: ["Love", "Compassion"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Love.mp3" },
  { id: 13, title: "Walking in the Light", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-03-08", duration: "39 min", scripture: "1 John 1:5–7", plays: 478, tags: ["Light", "Righteousness"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Walking.mp3" },
  { id: 14, title: "The Heart of Worship", speaker: "Grace Lin", series: "Stewardship", date: "2026-03-01", duration: "33 min", scripture: "Romans 12:1–2", plays: 356, tags: ["Worship", "Dedication"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Worship.mp3" },
  { id: 15, title: "Strength in Weakness", speaker: "David Okafor", series: "Anchored", date: "2026-02-22", duration: "40 min", scripture: "2 Corinthians 12:7–10", plays: 512, tags: ["Strength", "Humility"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Strength.mp3" },
  { id: 16, title: "The Great Commission Fulfilled", speaker: "Marcus Bell", series: "On Mission", date: "2026-02-15", duration: "44 min", scripture: "Matthew 28:16–20", plays: 389, tags: ["Commission", "Purpose"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Commission.mp3" },
  { id: 17, title: "Trusting When You Can't See", speaker: "Pastor James Whitfield", series: "Anchored", date: "2026-02-08", duration: "38 min", scripture: "Habakkuk 3:17–19", plays: 445, tags: ["Trust", "Faith"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Trusting.mp3" },
  { id: 18, title: "Breaking Free from Fear", speaker: "Amara Diallo", series: "Stewardship", date: "2026-02-01", duration: "35 min", scripture: "2 Timothy 1:7", plays: 398, tags: ["Fear", "Power"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Breaking.mp3" },
  { id: 19, title: "Living a Life of Purpose", speaker: "Grace Lin", series: "On Mission", date: "2026-01-25", duration: "37 min", scripture: "Ephesians 2:8–10", plays: 467, tags: ["Purpose", "Direction"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Purpose.mp3" },
  { id: 20, title: "Seeds of Faith, Harvest of Joy", speaker: "David Okafor", series: "Stewardship", date: "2026-01-18", duration: "31 min", scripture: "Galatians 6:7–9", plays: 321, tags: ["Sowing", "Harvest"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Seeds.mp3" },
  { id: 21, title: "The Transforming Power of Grace", speaker: "Marcus Bell", series: "Anchored", date: "2026-01-11", duration: "42 min", scripture: "Titus 2:11–14", plays: 534, tags: ["Grace", "Transformation"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Grace2.mp3" },
  { id: 22, title: "Hope Eternal", speaker: "Pastor James Whitfield", series: "On Mission", date: "2026-01-04", duration: "40 min", scripture: "Romans 15:4–5", plays: 489, tags: ["Hope", "Eternity"], audio: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==", audioName: "Hope2.mp3" },
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
  { id: 1, name: "2026 Annual Budget.pdf", type: "Finance", size: "1.2 MB", by: "David Okafor", date: "2026-05-20", access: "Leadership", description: "Complete annual budget for all ministries and operations" },
  { id: 2, name: "Volunteer Handbook.pdf", type: "Policy", size: "840 KB", by: "Admin", date: "2026-04-11", access: "All", description: "Guidelines and policies for all volunteers" },
  { id: 3, name: "Membership Directory.xlsx", type: "Members", size: "320 KB", by: "Admin", date: "2026-05-30", access: "Leadership", description: "Complete list of church members with contact info" },
  { id: 4, name: "VBS 2026 Curriculum.zip", type: "Children", size: "14 MB", by: "Sofia Reyes", date: "2026-05-18", access: "Ministry", description: "Vacation Bible School curriculum and materials" },
  { id: 5, name: "Facility Use Agreement.docx", type: "Policy", size: "120 KB", by: "Admin", date: "2026-03-02", access: "All", description: "Terms for using church facilities" },
  { id: 6, name: "Staff Handbook 2026.pdf", type: "Policy", size: "450 KB", by: "Admin", date: "2026-01-15", access: "Staff", description: "Policies and procedures for all staff members" },
  { id: 7, name: "Youth Ministry Budget.xlsx", type: "Finance", size: "280 KB", by: "Marcus Bell", date: "2026-05-25", access: "Ministry", description: "Detailed budget for youth ministry programs" },
  { id: 8, name: "Worship Team Guidelines.docx", type: "Worship", size: "190 KB", by: "Grace Lin", date: "2026-04-20", access: "Ministry", description: "Standards and expectations for worship team members" },
  { id: 9, name: "Building Renovation Plans.pdf", type: "Facilities", size: "3.2 MB", by: "David Okafor", date: "2026-05-15", access: "Leadership", description: "Architectural plans for sanctuary renovation project" },
  { id: 10, name: "Children's Ministry Policies.docx", type: "Children", size: "340 KB", by: "Sofia Reyes", date: "2026-03-10", access: "Ministry", description: "Safety and operational policies for children's programs" },
  { id: 11, name: "Missions Trip Budget 2026.xlsx", type: "Finance", size: "156 KB", by: "Amara Diallo", date: "2026-05-10", access: "Ministry", description: "Cost breakdown for summer missions trip to Guatemala" },
  { id: 12, name: "Prayer Request Guidelines.pdf", type: "Pastoral", size: "210 KB", by: "James Whitfield", date: "2026-02-28", access: "All", description: "How to submit and receive prayer requests" },
  { id: 13, name: "Baptism Policy.docx", type: "Pastoral", size: "95 KB", by: "James Whitfield", date: "2026-01-20", access: "Leadership", description: "Requirements and procedures for baptism" },
  { id: 14, name: "Financial Giving Report - May.pdf", type: "Finance", size: "520 KB", by: "David Okafor", date: "2026-05-31", access: "Leadership", description: "Monthly summary of tithes and offerings" },
  { id: 15, name: "Outreach Event Planning Template.docx", type: "Outreach", size: "85 KB", by: "Amara Diallo", date: "2026-04-05", access: "Ministry", description: "Template for planning community outreach events" },
  { id: 16, name: "Small Groups Directory.xlsx", type: "Members", size: "240 KB", by: "Admin", date: "2026-05-28", access: "All", description: "List of all small groups and their leaders" },
  { id: 17, name: "Audio/Visual Setup Guide.pdf", type: "Facilities", size: "2.1 MB", by: "Tech Team", date: "2026-03-15", access: "Staff", description: "Instructions for sound and projection systems" },
  { id: 18, name: "Member Care Guidelines.docx", type: "Pastoral", size: "310 KB", by: "James Whitfield", date: "2026-02-10", access: "Leadership", description: "How to care for members in crisis or transition" },
];

const tasks = [
  { id: 1, text: "Approve June worship set list", done: false, due: "Today" },
  { id: 2, text: "Review baptism candidate list", done: false, due: "Tomorrow" },
  { id: 3, text: "Sign off on May financial report", done: false, due: "Fri" },
  { id: 4, text: "Confirm guest speaker for July", done: true, due: "Done" },
];

const baptisms = [
  { id: 1, name: "Tobias Andersen", date: "2026-06-21", age: 28, ministry: "Hospitality", sponsor: "James Whitfield", status: "Scheduled", testimony: "I came to faith through the welcoming community of this church." },
  { id: 2, name: "Naomi Brooks", date: "2026-06-21", age: 19, ministry: "Children", sponsor: "Sofia Reyes", status: "Scheduled", testimony: "My journey with Jesus began this year, and I'm ready to take this step." },
  { id: 3, name: "Joshua Martinez", date: "2026-06-21", age: 35, ministry: "Discipleship", sponsor: "James Whitfield", status: "Scheduled", testimony: "After months of study and prayer, I'm ready to commit my life to Christ." },
  { id: 4, name: "Rachel Thompson", date: "2026-05-28", age: 22, ministry: "Youth", sponsor: "Marcus Bell", status: "Completed", testimony: "God has transformed my life through this community." },
  { id: 5, name: "Daniel Okoro", date: "2026-05-28", age: 45, ministry: "Worship", sponsor: "Grace Lin", status: "Completed", testimony: "I've been seeking God, and I found my family here." },
];

const gallery = [
  { id: 1, name: "Sunday Service May 31", url: "https://picsum.photos/600/400?random=1", category: "Services", date: "2026-05-31", uploadedBy: "James Whitfield" },
  { id: 2, name: "Youth Group Game Night", url: "https://picsum.photos/600/400?random=2", category: "Events", date: "2026-06-06", uploadedBy: "Marcus Bell" },
  { id: 3, name: "Children's VBS Day 1", url: "https://picsum.photos/600/400?random=3", category: "Children", date: "2026-06-09", uploadedBy: "Sofia Reyes" },
  { id: 4, name: "Community Food Drive", url: "https://picsum.photos/600/400?random=4", category: "Outreach", date: "2026-06-13", uploadedBy: "Amara Diallo" },
  { id: 5, name: "Worship Team Rehearsal", url: "https://picsum.photos/600/400?random=5", category: "Worship", date: "2026-06-05", uploadedBy: "Grace Lin" },
  { id: 6, name: "Spring Retreat", url: "https://picsum.photos/600/400?random=6", category: "Retreats", date: "2026-05-18", uploadedBy: "Marcus Bell" },
];

const flyers = [
  { id: 1, type: "Service", title: "Sunday Worship Service", date: "2026-06-07", time: "10:00 AM", location: "Main Sanctuary", ministry: "Worship", image: "https://picsum.photos/500/600?random=11", created: "2026-05-25", createdBy: "James Whitfield", tags: ["Worship", "Weekly"] },
  { id: 2, type: "Event", title: "Youth Game Night", date: "2026-06-06", time: "6:30 PM", location: "Fellowship Hall", ministry: "Youth", image: "https://picsum.photos/500/600?random=12", created: "2026-05-26", createdBy: "Marcus Bell", tags: ["Youth", "Fun"] },
  { id: 3, type: "Announcement", title: "Community Food Drive", date: "2026-06-13", time: "9:00 AM", location: "Parking Lot", ministry: "Outreach", image: "https://picsum.photos/500/600?random=13", created: "2026-05-20", createdBy: "Amara Diallo", tags: ["Outreach", "Service"] },
  { id: 4, type: "Volunteer", title: "Volunteers Needed for VBS", date: "2026-06-09", time: "All Day", location: "Room 110", ministry: "Children", image: "https://picsum.photos/500/600?random=14", created: "2026-05-18", createdBy: "Sofia Reyes", tags: ["Children", "Volunteer"] },
  { id: 5, type: "Donation", title: "Building Fund Push", goal: "$150,000", progress: 64, ministry: "Finance", image: "https://picsum.photos/500/600?random=15", created: "2026-05-15", createdBy: "David Okafor", tags: ["Giving", "Finance"] },
  { id: 6, type: "Ministry", title: "Join the Worship Team", ministry: "Worship", image: "https://picsum.photos/500/600?random=16", created: "2026-05-22", createdBy: "Grace Lin", tags: ["Music", "Worship"] },
  { id: 7, type: "Class", title: "Bible Study — Paul's Letters", date: "2026-06-10", time: "7:00 PM", location: "Room 204", ministry: "Discipleship", image: "https://picsum.photos/500/600?random=17", created: "2026-05-23", createdBy: "James Whitfield", tags: ["Bible", "Learning"] },
  { id: 8, type: "Special Event", title: "Baptism Sunday 2026", date: "2026-06-21", time: "10:00 AM", location: "Main Sanctuary", ministry: "Pastoral", image: "https://picsum.photos/500/600?random=18", created: "2026-05-10", createdBy: "James Whitfield", tags: ["Baptism", "Celebration"] },
  { id: 9, type: "Prayer", title: "Prayer Meeting — Intercessory", date: "2026-06-08", time: "6:00 PM", location: "Room 101", ministry: "Pastoral", image: "https://picsum.photos/500/600?random=19", created: "2026-05-24", createdBy: "James Whitfield", tags: ["Prayer", "Intercession"] },
  { id: 10, type: "Conference", title: "Summer Leadership Summit", date: "2026-07-15", location: "Retreat Center", ministry: "Leadership", image: "https://picsum.photos/500/600?random=20", created: "2026-05-12", createdBy: "David Okafor", tags: ["Leadership", "Summit"] },
];

const DB = { members, events, ministries, donations, funds, givingTrend, attendanceTrend, sermons, prayers, posts, chats, chatThread, documents, tasks, baptisms, gallery, flyers };

export { members, events, ministries, donations, funds, givingTrend, attendanceTrend, sermons, prayers, posts, chats, chatThread, documents, tasks, baptisms, gallery, flyers };
export default DB;
