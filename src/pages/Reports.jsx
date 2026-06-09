import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Stat, Progress } from '../components/ui';
import { BarChart } from '../components/charts';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const MINISTRY_COLORS = ['var(--primary)', '#E85D04', '#2D9A27', '#9B5DE5', '#F72585', '#0077B6']; // Colores para ministerios

const fmt = n => '$' + (n || 0).toLocaleString(); // Formatea como moneda
const fmtK = n => n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + (n || 0); // Formatea en miles

const getMonth = dateStr => {
    if (!dateStr) return '?'; // Si no hay fecha retorna interrogante
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }); // Ej: "Jan"
};

export default function Reports({ role }) {
    const { t } = useTranslation();

    const [donations, setDonations] = useState([]); // Lista de donaciones del backend
    const [members, setMembers] = useState([]); // Lista de miembros del backend
    const [events, setEvents] = useState([]); // Lista de eventos del backend
    const [prayers, setPrayers] = useState([]); // Lista de peticiones del backend
    const [loading, setLoading] = useState(true); // Estado de carga inicial
    const [tab, setTab] = useState('overview'); // Tab activo

    useEffect(() => {
        fetchAllData(); // Carga todos los datos al montar
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken'); // Lee token de sesion
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [donRes, memRes, evtRes, prayRes] = await Promise.all([
                fetch('http://localhost:5000/api/donations', { headers }),
                fetch('http://localhost:5000/api/members', { headers }),
                fetch('http://localhost:5000/api/events', { headers }),
                fetch('http://localhost:5000/api/prayer-requests', { headers })
            ]);

            if (donRes.ok) setDonations(await donRes.json()); // Actualiza donaciones
            if (memRes.ok) setMembers(await memRes.json()); // Actualiza miembros
            if (evtRes.ok) setEvents(await evtRes.json()); // Actualiza eventos
            if (prayRes.ok) setPrayers(await prayRes.json()); // Actualiza peticiones
        } catch (err) {
            console.error('Error fetching report data:', err);
        } finally {
            setLoading(false); // Desactiva spinner siempre
        }
    };

    // Calcula métricas
    const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0); // Total YTD
    const avgDonation = donations.length ? Math.round(totalDonations / donations.length) : 0; // Promedio
    const activeMembers = members.filter(m => m.status === 'Active').length; // Miembros activos
    const thisMonth = new Date().getMonth(); // Mes actual
    const newMembersThisMonth = members.filter(m => new Date(m.joinDate).getMonth() === thisMonth).length; // Nuevos este mes
    const upcomingEvents = events.filter(e => e.status === 'Upcoming').length; // Eventos proximos
    const avgAttendance = events.length ? Math.round(events.reduce((s, e) => s + (e.attendees || 0), 0) / events.length) : 0; // Asistencia promedio
    const answeredPrayers = prayers.filter(p => p.answered).length; // Peticiones respondidas
    const baptized = members.filter(m => m.baptized === 'Baptized').length; // Bautizados
    const notYet = members.filter(m => m.baptized === 'Not yet').length; // No bautizados
    const newBeliever = members.filter(m => m.baptized === 'New believer').length; // Nuevos creyentes
    const avgCapacityPct = events.length ? Math.round(events.reduce((s, e) => s + (e.attendees / (e.capacity || 1)) * 100, 0) / events.length) : 0; // Capacidad promedio

    // Donaciones por fondo
    const donationsByFund = donations.reduce((acc, d) => {
        const fund = d.fund || 'Other';
        acc[fund] = (acc[fund] || 0) + (d.amount || 0);
        return acc;
    }, {});

    // Donaciones por mes para el chart
    const donationsByMonth = donations.reduce((acc, d) => {
        const month = getMonth(d.date || d.createdAt);
        acc[month] = (acc[month] || 0) + (d.amount || 0);
        return acc;
    }, {});
    const givingTrendData = Object.entries(donationsByMonth).map(([label, value]) => ({ label, value })); // Array para BarChart

    // Miembros por ministerio
    const membersByMinistry = members.reduce((acc, m) => {
        const min = m.ministry || 'Other';
        acc[min] = (acc[min] || 0) + 1;
        return acc;
    }, {});
    const ministryData = Object.entries(membersByMinistry)
        .sort((a, b) => b[1] - a[1]) // Ordena de mayor a menor
        .map(([name, count], i) => ({ name, count, color: MINISTRY_COLORS[i % MINISTRY_COLORS.length] }));

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'giving', label: 'Giving' },
        { value: 'members', label: 'Members' },
        { value: 'events', label: 'Events' },
    ];

    if (loading) {
        return (
            <Card style={{ textAlign: 'center', padding: 60 }}>
                <p className="muted">Loading reports...</p>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>

            {/* Barra de tabs */}
            <div className="fade-up" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                {tabs.map(t => {
                    const on = tab === t.value; // Tab activo
                    return (
                        <button key={t.value} onClick={() => setTab(t.value)}
                                style={{ padding: '11px 16px', fontSize: 14, fontWeight: 600, border: 'none', background: 'none', color: on ? 'var(--primary)' : 'var(--text-muted)', position: 'relative', marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {t.label}
                            <span style={{ position: 'absolute', left: 12, right: 12, bottom: 0, height: 2.5, borderRadius: 3, background: on ? 'var(--primary)' : 'transparent' }} />
                        </button>
                    );
                })}
            </div>

            {/* TAB OVERVIEW */}
            {tab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)' }}>
                        <Stat icon={Icon.Gift} label="Total Giving (YTD)" value={fmtK(totalDonations)} delta={donations.length + ' gifts'} tint="primary" />
                        <Stat icon={Icon.Users} label="Active Members" value={activeMembers} delta={newMembersThisMonth > 0 ? '+' + newMembersThisMonth + ' this month' : 'stable'} tint="sage" />
                        <Stat icon={Icon.Calendar} label="Upcoming Events" value={upcomingEvents} delta={'avg ' + avgAttendance + ' attending'} tint="warn" />
                        <Stat icon={Icon.Heart} label="Prayer Requests" value={prayers.length} delta={answeredPrayers + ' answered'} tint="primary" />
                    </div>

                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Giving by Month</h3>
                            {givingTrendData.length > 0
                                ? <BarChart data={givingTrendData} color="var(--primary)" fmt={v => '$' + (v / 1000).toFixed(1) + 'k'} />
                                : <p className="muted" style={{ textAlign: 'center', padding: 20 }}>No giving data yet</p>}
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Funds Breakdown</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {Object.entries(donationsByFund).map(([fund, amount]) => (
                                    <div key={fund}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 600 }}>{fund}</span>
                                            <span className="muted">{fmt(amount)}</span>
                                        </div>
                                        <Progress value={(amount / totalDonations) * 100} tone="primary" height={7} />
                                    </div>
                                ))}
                                {Object.keys(donationsByFund).length === 0 && <p className="muted">No fund data yet</p>}
                            </div>
                        </Card>
                    </div>

                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Members by Ministry</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {ministryData.map(({ name, count, color }) => (
                                    <div key={name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                                                <span style={{ fontWeight: 600 }}>{name}</span>
                                            </div>
                                            <span className="muted">{count} members</span>
                                        </div>
                                        <Progress value={activeMembers ? (count / activeMembers) * 100 : 0} tone="primary" height={6} />
                                    </div>
                                ))}
                                {ministryData.length === 0 && <p className="muted">No ministry data yet</p>}
                            </div>
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Baptism Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { label: 'Baptized', value: baptized, tone: 'primary' },
                                    { label: 'New Believer', value: newBeliever, tone: 'warn' },
                                    { label: 'Not Yet', value: notYet, tone: 'neutral' }
                                ].map(({ label, value, tone }) => (
                                    <div key={label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 600 }}>{label}</span>
                                            <span className="muted">{value} ({members.length ? Math.round(value / members.length * 100) : 0}%)</span>
                                        </div>
                                        <Progress value={members.length ? (value / members.length) * 100 : 0} tone={tone} height={7} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB GIVING */}
            {tab === 'giving' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)' }}>
                        <Stat icon={Icon.Gift} label="Total YTD" value={fmtK(totalDonations)} tint="primary" />
                        <Stat icon={Icon.Chart} label="Average Gift" value={fmt(avgDonation)} tint="sage" />
                        <Stat icon={Icon.Clock} label="Total Gifts" value={donations.length} tint="warn" />
                        <Stat icon={Icon.Heart} label="Recurring" value={donations.filter(d => d.recurring).length} tint="primary" />
                    </div>
                    <Card className="fade-up">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Giving Trend</h3>
                        {givingTrendData.length > 0
                            ? <BarChart data={givingTrendData} color="var(--primary)" fmt={v => '$' + (v / 1000).toFixed(1) + 'k'} />
                            : <p className="muted" style={{ textAlign: 'center', padding: 20 }}>No giving data yet</p>}
                    </Card>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--gap)' }}>
                        {Object.entries(donationsByFund).map(([fund, amount]) => (
                            <Card key={fund}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: 15 }}>{fund}</h4>
                                        <p className="faint" style={{ fontSize: 12, marginTop: 3 }}>{donations.filter(d => d.fund === fund).length} gifts</p>
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{fmt(amount)}</div>
                                </div>
                                <Progress value={(amount / totalDonations) * 100} tone="primary" height={8} />
                                <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>{Math.round((amount / totalDonations) * 100)}% of total giving</p>
                            </Card>
                        ))}
                    </div>
                    <Card className="fade-up">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Donations</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {donations.slice(0, 8).map(d => (
                                <div key={d._id || d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Avatar name={d.donor || 'Anonymous'} size={36} />
                                        <div>
                                            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.donor || 'Anonymous'}</div>
                                            <div className="faint" style={{ fontSize: 12 }}>{d.fund} · {d.method}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 15, fontWeight: 700 }}>${d.amount}</span>
                                        {d.recurring && <Badge tone="sage">Recurring</Badge>}
                                    </div>
                                </div>
                            ))}
                            {donations.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: 20 }}>No donations yet</p>}
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB MEMBERS */}
            {tab === 'members' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)' }}>
                        <Stat icon={Icon.Users} label="Total Members" value={members.length} tint="primary" />
                        <Stat icon={Icon.Check} label="Active" value={activeMembers} delta={members.length ? Math.round(activeMembers / members.length * 100) + '% of total' : '0%'} tint="sage" />
                        <Stat icon={Icon.Cross} label="Baptized" value={baptized} delta={members.length ? Math.round(baptized / members.length * 100) + '% of members' : '0%'} tint="warn" />
                        <Stat icon={Icon.Plus} label="New This Month" value={newMembersThisMonth} tint="primary" />
                    </div>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>By Ministry</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {ministryData.map(({ name, count, color }) => (
                                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '22', color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                            <Icon.Hands size={16} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                                                <span style={{ fontWeight: 600 }}>{name}</span>
                                                <span className="muted">{count}</span>
                                            </div>
                                            <Progress value={activeMembers ? (count / activeMembers) * 100 : 0} tone="primary" height={6} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Baptism Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { label: 'Baptized', value: baptized, tone: 'primary' },
                                    { label: 'New Believer', value: newBeliever, tone: 'warn' },
                                    { label: 'Not Yet', value: notYet, tone: 'neutral' }
                                ].map(({ label, value, tone }) => (
                                    <div key={label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 600 }}>{label}</span>
                                            <span className="muted">{value} ({members.length ? Math.round(value / members.length * 100) : 0}%)</span>
                                        </div>
                                        <Progress value={members.length ? (value / members.length) * 100 : 0} tone={tone} height={7} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <Card className="fade-up">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Member List</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {members.map(m => (
                                <div key={m._id || m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                    <Avatar name={m.name} size={36} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                                        <div className="faint" style={{ fontSize: 12 }}>{m.role} · {m.ministry}</div>
                                    </div>
                                    <Badge tone={m.status === 'Active' ? 'sage' : 'neutral'} dot>{m.status}</Badge>
                                    <Badge tone={m.baptized === 'Baptized' ? 'primary' : 'neutral'}>{m.baptized}</Badge>
                                </div>
                            ))}
                            {members.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: 20 }}>No members yet</p>}
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB EVENTS */}
            {tab === 'events' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
                    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)' }}>
                        <Stat icon={Icon.Calendar} label="Total Events" value={events.length} tint="primary" />
                        <Stat icon={Icon.Clock} label="Upcoming" value={upcomingEvents} tint="sage" />
                        <Stat icon={Icon.Users} label="Avg Attendance" value={avgAttendance} tint="warn" />
                        <Stat icon={Icon.Chart} label="Avg Capacity Used" value={avgCapacityPct + '%'} tint="primary" />
                    </div>
                    <Card className="fade-up">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Attendance by Ministry</h3>
                        {(() => {
                            const byMin = events.reduce((acc, e) => {
                                const min = e.ministry || 'Other';
                                acc[min] = (acc[min] || 0) + (e.attendees || 0); // Suma asistentes por ministerio
                                return acc;
                            }, {});
                            const data = Object.entries(byMin).map(([label, value]) => ({ label, value }));
                            return data.length > 0
                                ? <BarChart data={data} color="var(--primary)" fmt={v => v + ' people'} />
                                : <p className="muted" style={{ textAlign: 'center', padding: 20 }}>No event data yet</p>;
                        })()}
                    </Card>
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>All Events</h3>
                        {events.map(e => {
                            const pct = Math.round((e.attendees / (e.capacity || 1)) * 100); // Porcentaje de llenado
                            return (
                                <Card key={e._id || e.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, fontSize: 15 }}>{e.title}</h4>
                                            <div className="faint" style={{ fontSize: 12, marginTop: 4 }}>{e.ministry} · {e.location} · {e.time}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Badge tone={e.status === 'Upcoming' ? 'primary' : e.status === 'Planning' ? 'warn' : 'neutral'} dot>{e.status}</Badge>
                                            {e.recurring && <Badge tone="sage">Recurring</Badge>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 8 }}>
                                        <span className="muted">Attendance</span>
                                        <span style={{ fontWeight: 700 }}>{e.attendees} / {e.capacity} <span className="faint">({pct}%)</span></span>
                                    </div>
                                    <Progress value={pct} tone={pct > 85 ? 'warn' : 'primary'} height={7} />
                                </Card>
                            );
                        })}
                        {events.length === 0 && <Card style={{ textAlign: 'center', padding: 40 }}><p className="muted">No events yet</p></Card>}
                    </div>
                </div>
            )}
        </div>
    );
}