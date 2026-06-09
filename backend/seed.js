// seed.js — Ejecutar con: node seed.js
// Llena la base de datos de ChurchConnect con datos de ejemplo realistas

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Church from './models/Church.js';
import Member from './models/Member.js';
import Ministry from './models/Ministry.js';
import Event from './models/Event.js';
import Sermon from './models/Sermon.js';
import Document from './models/Document.js';
import Donation from './models/Donation.js';
import Post from './models/Post.js';
import PrayerRequest from './models/PrayerRequest.js';

dotenv.config(); // Carga variables de entorno del .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Conecta usando la URI del .env
        console.log('✅ MongoDB conectado');
    } catch (err) {
        console.error('❌ Error conectando MongoDB:', err.message);
        process.exit(1);
    }
};

const seedUsers = async () => {
    const users = [
        { name: 'Pastor James Whitfield', email: 'pastor@gracecc.org', password: 'password123', role: 'Admin', phone: '+41 79 123 45 67' },
        { name: 'Sarah Mitchell', email: 'sarah@gracecc.org', password: 'password123', role: 'Ministry Leader', phone: '+41 79 234 56 78' },
        { name: 'Marcus Bell', email: 'marcus@gracecc.org', password: 'password123', role: 'Member', phone: '+41 79 345 67 89' },
        { name: 'Eleanor Hughes', email: 'eleanor@gracecc.org', password: 'password123', role: 'Member', phone: '+41 79 456 78 90' },
        { name: 'David Kim', email: 'david@gracecc.org', password: 'password123', role: 'Treasurer', phone: '+41 79 567 89 01' }
    ];
    await User.deleteMany({}); // Limpia usuarios existentes
    for (const userData of users) {
        await User.create(userData); // create() activa el pre save hook que hashea la contraseña
    }
    console.log('👤 Usuarios creados: 5');
};

const seedChurch = async () => {
    const churchData = {
        name: 'Grace Community Church',
        tagline: 'Faith · Community · Purpose',
        address: 'Bahnhofstrasse 42, 8001 Zürich',
        phone: '+41 44 123 45 67',
        email: 'info@gracecc.org',
        website: 'www.gracecc.org',
        founded: 1998,
        denomination: 'Non-denominational',
        description: 'A vibrant community of believers committed to growing in faith and serving our city.'
    };
    await Church.deleteMany({});
    const church = await Church.create(churchData);
    console.log('⛪ Iglesia creada:', church.name);
};

const seedMinistries = async () => {
    const ministries = [
        { name: 'Worship', description: 'Leading the congregation in meaningful worship through music and arts.', lead: 'Sarah Mitchell', members: [], meetingTime: 'Saturdays 10:00', color: '#3B5BA5' },
        { name: 'Youth', description: 'Empowering the next generation with faith, community, and purpose.', lead: 'Marcus Bell', members: [], meetingTime: 'Fridays 19:00', color: '#E85D04' },
        { name: 'Children', description: 'Creating a safe and fun environment for kids to learn about God.', lead: 'Eleanor Hughes', members: [], meetingTime: 'Sundays 10:00', color: '#2D9A27' },
        { name: 'Outreach', description: 'Serving our community through food drives, volunteering, and local missions.', lead: 'Amara Diallo', members: [], meetingTime: 'Saturdays 09:00', color: '#9B5DE5' },
        { name: 'Hospitality', description: 'Welcoming newcomers and making everyone feel at home in our church family.', lead: 'Grace Lin', members: [], meetingTime: 'Sundays 09:30', color: '#F72585' },
        { name: 'Discipleship', description: 'Growing deeper in faith through Bible study, mentorship, and small groups.', lead: 'Pastor James Whitfield', members: [], meetingTime: 'Wednesdays 19:30', color: '#0077B6' }
    ];
    await Ministry.deleteMany({});
    const created = await Ministry.insertMany(ministries);
    console.log('🙌 Ministerios creados:', created.length);
};

const seedMembers = async () => {
    const members = [
        { name: 'Pastor James Whitfield', email: 'pastor@gracecc.org', phone: '+41 79 123 45 67', role: 'Pastor', ministry: 'Discipleship', status: 'Active', joinDate: new Date('2015-03-15'), baptized: 'Baptized' },
        { name: 'Sarah Mitchell', email: 'sarah@gracecc.org', phone: '+41 79 234 56 78', role: 'Ministry Leader', ministry: 'Worship', status: 'Active', joinDate: new Date('2017-06-20'), baptized: 'Baptized' },
        { name: 'Marcus Bell', email: 'marcus@gracecc.org', phone: '+41 79 345 67 89', role: 'Ministry Leader', ministry: 'Youth', status: 'Active', joinDate: new Date('2018-09-10'), baptized: 'Baptized' },
        { name: 'Eleanor Hughes', email: 'eleanor@gracecc.org', phone: '+41 79 456 78 90', role: 'Ministry Leader', ministry: 'Children', status: 'Active', joinDate: new Date('2019-01-05'), baptized: 'Baptized' },
        { name: 'David Kim', email: 'david@gracecc.org', phone: '+41 79 567 89 01', role: 'Treasurer', ministry: 'Discipleship', status: 'Active', joinDate: new Date('2016-08-14'), baptized: 'Baptized' },
        { name: 'Amara Diallo', email: 'amara@gracecc.org', phone: '+41 79 678 90 12', role: 'Ministry Leader', ministry: 'Outreach', status: 'Active', joinDate: new Date('2020-02-28'), baptized: 'Baptized' },
        { name: 'Grace Lin', email: 'grace@gracecc.org', phone: '+41 79 789 01 23', role: 'Ministry Leader', ministry: 'Hospitality', status: 'Active', joinDate: new Date('2021-05-17'), baptized: 'New believer' },
        { name: 'Henry Caldwell', email: 'henry@gracecc.org', phone: '+41 79 890 12 34', role: 'Member', ministry: 'Outreach', status: 'Active', joinDate: new Date('2022-03-08'), baptized: 'Baptized' },
        { name: 'Sofia Reyes', email: 'sofia@gracecc.org', phone: '+41 79 901 23 45', role: 'Member', ministry: 'Worship', status: 'Active', joinDate: new Date('2021-11-22'), baptized: 'Baptized' },
        { name: 'Thomas Weber', email: 'thomas@gracecc.org', phone: '+41 79 012 34 56', role: 'Member', ministry: 'Youth', status: 'Active', joinDate: new Date('2023-01-15'), baptized: 'Not yet' },
        { name: 'Lena Müller', email: 'lena@gracecc.org', phone: '+41 79 111 22 33', role: 'Member', ministry: 'Children', status: 'Active', joinDate: new Date('2022-07-30'), baptized: 'Baptized' },
        { name: 'Noah Fischer', email: 'noah@gracecc.org', phone: '+41 79 222 33 44', role: 'Member', ministry: 'Discipleship', status: 'Inactive', joinDate: new Date('2020-04-12'), baptized: 'Baptized' }
    ];
    await Member.deleteMany({});
    const created = await Member.insertMany(members);
    console.log('👥 Miembros creados:', created.length);
};

const seedEvents = async () => {
    const events = [
        { title: 'Sunday Worship Service', date: new Date('2026-06-15'), time: '10:00', location: 'Main Sanctuary', ministry: 'Worship', capacity: 300, attendees: 187, status: 'Upcoming', lead: 'Pastor James Whitfield', description: 'Join us for our weekly Sunday worship service.', recurring: true },
        { title: 'Youth Friday Night', date: new Date('2026-06-13'), time: '19:00', location: 'Youth Hall', ministry: 'Youth', capacity: 80, attendees: 54, status: 'Upcoming', lead: 'Marcus Bell', description: 'A night of games, worship, and fellowship for teens.', recurring: true },
        { title: 'Community Food Drive', date: new Date('2026-06-21'), time: '09:00', location: 'Community Center', ministry: 'Outreach', capacity: 50, attendees: 23, status: 'Upcoming', lead: 'Amara Diallo', description: 'Serving families in need through our monthly food distribution.', recurring: false },
        { title: 'Baptism Sunday', date: new Date('2026-06-22'), time: '11:00', location: 'Main Sanctuary', ministry: 'Discipleship', capacity: 300, attendees: 210, status: 'Upcoming', lead: 'Pastor James Whitfield', description: 'A special service celebrating new believers taking the step of baptism.', recurring: false },
        { title: "Children's Summer Camp Kickoff", date: new Date('2026-06-28'), time: '09:00', location: 'Fellowship Hall', ministry: 'Children', capacity: 60, attendees: 45, status: 'Planning', lead: 'Eleanor Hughes', description: 'Launching our summer camp program for kids ages 6-12.', recurring: false },
        { title: 'Midweek Prayer & Study', date: new Date('2026-06-11'), time: '19:30', location: 'Assembly Hall', ministry: 'Discipleship', capacity: 100, attendees: 62, status: 'Upcoming', lead: 'Pastor James Whitfield', description: 'Weekly deep dive into scripture and corporate prayer.', recurring: true },
        { title: 'Worship Team Rehearsal', date: new Date('2026-06-14'), time: '10:00', location: 'Sanctuary Stage', ministry: 'Worship', capacity: 30, attendees: 18, status: 'Upcoming', lead: 'Sarah Mitchell', description: 'Weekly rehearsal preparing for Sunday worship.', recurring: true },
        { title: 'Easter Sunday Service', date: new Date('2026-04-05'), time: '10:00', location: 'Main Sanctuary', ministry: 'Worship', capacity: 350, attendees: 312, status: 'Past', lead: 'Pastor James Whitfield', description: 'Celebrating the resurrection of Jesus Christ.', recurring: false }
    ];
    await Event.deleteMany({});
    const created = await Event.insertMany(events);
    console.log('📅 Eventos creados:', created.length);
};

const seedSermons = async () => {
    const sermons = [
        { title: 'Walking in Faith', speaker: 'Pastor James Whitfield', date: new Date('2026-06-08'), series: 'Living the Word', scripture: 'Hebrews 11:1-6', duration: '42 min', description: 'Faith is not the absence of doubt — it is moving forward despite it.', plays: 187 },
        { title: 'The Power of Community', speaker: 'Sarah Mitchell', date: new Date('2026-06-01'), series: 'Together We Rise', scripture: 'Acts 2:42-47', duration: '38 min', description: 'Why God designed us to live in authentic community with one another.', plays: 143 },
        { title: 'Grace That Transforms', speaker: 'Pastor James Whitfield', date: new Date('2026-05-25'), series: 'Grace & Truth', scripture: 'Ephesians 2:1-10', duration: '45 min', description: "Understanding the depth of God's grace and how it changes everything.", plays: 221 },
        { title: 'Serving the City', speaker: 'Amara Diallo', date: new Date('2026-05-18'), series: 'Called to Serve', scripture: 'Matthew 25:31-46', duration: '35 min', description: 'How our faith must overflow into practical service to those around us.', plays: 98 }
    ];
    await Sermon.deleteMany({});
    const created = await Sermon.insertMany(sermons);
    console.log('🎤 Sermones creados:', created.length);
};

const seedDocuments = async () => {
    const documents = [
        { name: '2026 Annual Budget.pdf', type: 'Finance', size: '1.2 MB', by: 'David Kim', date: new Date('2026-01-15'), access: 'Leadership' },
        { name: 'Volunteer Handbook.pdf', type: 'Policy', size: '840 KB', by: 'Pastor James Whitfield', date: new Date('2026-02-01'), access: 'All' },
        { name: 'Membership Directory.xlsx', type: 'Members', size: '320 KB', by: 'Sarah Mitchell', date: new Date('2026-03-10'), access: 'Leadership' },
        { name: 'VBS 2026 Curriculum.zip', type: 'Children', size: '14 MB', by: 'Eleanor Hughes', date: new Date('2026-04-05'), access: 'Ministry' },
        { name: 'Facility Use Agreement.docx', type: 'Policy', size: '120 KB', by: 'Pastor James Whitfield', date: new Date('2025-12-01'), access: 'All' },
        { name: 'Staff Handbook 2026.pdf', type: 'Policy', size: '450 KB', by: 'Pastor James Whitfield', date: new Date('2026-01-05'), access: 'Private' },
        { name: 'Youth Ministry Budget.xlsx', type: 'Finance', size: '280 KB', by: 'Marcus Bell', date: new Date('2026-02-20'), access: 'Leadership' },
        { name: 'Worship Team Guidelines.docx', type: 'Policy', size: '190 KB', by: 'Sarah Mitchell', date: new Date('2026-03-01'), access: 'Ministry' },
        { name: 'Building Renovation Plans.pdf', type: 'Other', size: '3.2 MB', by: 'David Kim', date: new Date('2026-04-20'), access: 'Leadership' },
        { name: "Children's Ministry Policies.docx", type: 'Children', size: '340 KB', by: 'Eleanor Hughes', date: new Date('2026-01-30'), access: 'Ministry' },
        { name: 'Missions Trip Budget 2026.xlsx', type: 'Finance', size: '156 KB', by: 'Amara Diallo', date: new Date('2026-05-01'), access: 'Leadership' }
    ];
    await Document.deleteMany({});
    const created = await Document.insertMany(documents);
    console.log('📄 Documentos creados:', created.length);
};

const seedDonations = async () => {
    const donations = [
        { donor: 'David Kim', amount: 500, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Bank' },
        { donor: 'Eleanor Hughes', amount: 200, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Cash' },
        { donor: 'Anonymous', amount: 1000, fund: 'Building Fund', date: new Date('2026-05-28'), method: 'Bank' },
        { donor: 'Marcus Bell', amount: 150, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Online' },
        { donor: 'Sofia Reyes', amount: 75, fund: 'Missions', date: new Date('2026-05-25'), method: 'Cash' },
        { donor: 'Thomas Weber', amount: 300, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Bank' },
        { donor: 'Henry Caldwell', amount: 50, fund: 'Benevolence', date: new Date('2026-06-08'), method: 'Cash' },
        { donor: 'Lena Müller', amount: 250, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Bank' },
        { donor: 'Grace Lin', amount: 100, fund: 'Other', date: new Date('2026-05-18'), method: 'Online' },
        { donor: 'Amara Diallo', amount: 180, fund: 'General Tithe', date: new Date('2026-06-01'), method: 'Bank' }
    ];
    await Donation.deleteMany({});
    const created = await Donation.insertMany(donations);
    console.log('💰 Donaciones creadas:', created.length);
};

const seedPosts = async () => {
    const posts = [
        { by: 'Marcus Bell', role: 'Youth Leader', text: 'Huge thanks to everyone who came out to game night! 48 students and not a single quiet moment. Next week: outdoor movie under the stars 🌟', likes: 42, comments: 9, pinned: false },
        { by: 'Pastor James Whitfield', role: 'Lead Pastor', text: "Reminder: Baptism Sunday is June 22nd. If you've been considering taking this step, reach out to me or any of our pastors — we'd love to walk with you.", likes: 86, comments: 14, pinned: true },
        { by: 'Amara Diallo', role: 'Outreach Lead', text: 'Our food drive needs 10 more volunteers for Saturday morning. Sign up at the welcome desk or reply here. Many hands make light work! 🙌', likes: 37, comments: 6, pinned: false },
        { by: 'Sarah Mitchell', role: 'Worship Leader', text: 'Set list for Sunday is posted in the Worship Team folder. Please review before Saturday rehearsal. Looking forward to worshipping with you all 🎵', likes: 28, comments: 4, pinned: false },
        { by: 'Eleanor Hughes', role: 'Children Director', text: "VBS registration is now open! We have space for 60 kids this summer. Share with your neighbors and friends — it's going to be an amazing week! 🎉", likes: 54, comments: 11, pinned: false }
    ];
    await Post.deleteMany({});
    const created = await Post.insertMany(posts);
    console.log('📝 Posts creados:', created.length);
};

const seedPrayerRequests = async () => {
    const prayers = [
        { by: 'Eleanor Hughes', text: "Please pray for my mother's recovery after her surgery this week.", category: 'Health', prayers: 24, answered: false },
        { by: 'Anonymous', text: 'Seeking wisdom and peace about a big career decision ahead. Feeling uncertain but trusting God.', category: 'Guidance', prayers: 12, answered: false },
        { by: 'Sofia Reyes', text: 'Thankful — our family welcomed a healthy baby girl! Praise God for His faithfulness! 🙏', category: 'Praise', prayers: 58, answered: true },
        { by: 'Henry Caldwell', text: "Pray for the food drive Saturday, that we'd reach families in need and show God's love in action.", category: 'Outreach', prayers: 19, answered: false },
        { by: 'Grace Lin', text: 'For our youth as they prepare for summer camp — safety, growth, and life-changing encounters with God.', category: 'Youth', prayers: 31, answered: false },
        { by: 'Anonymous', text: "Please pray for my marriage. We are going through a difficult season and need God's healing and grace.", category: 'Guidance', prayers: 45, answered: false },
        { by: 'Marcus Bell', text: 'Praise report: three students from youth group gave their lives to Christ last Friday night! Glory to God! 🎉', category: 'Praise', prayers: 72, answered: true }
    ];
    await PrayerRequest.deleteMany({});
    const created = await PrayerRequest.insertMany(prayers);
    console.log('🙏 Peticiones de oración creadas:', created.length);
};

const runSeed = async () => {
    await connectDB();
    console.log('\n🌱 Iniciando seed de ChurchConnect...\n');
    try {
        await seedChurch();
        await seedUsers();
        await seedMinistries();
        await seedMembers();
        await seedEvents();
        await seedSermons();
        await seedDocuments();
        await seedDonations();
        await seedPosts();
        await seedPrayerRequests();
        console.log('\n✅ Seed completado exitosamente!');
        console.log('📧 Login: pastor@gracecc.org / password123\n');
    } catch (err) {
        console.error('\n❌ Error durante el seed:', err.message);
        console.error(err);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión MongoDB cerrada');
        process.exit(0);
    }
};

runSeed();