import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Stat, Badge, Button, Avatar, Progress, Segmented } from '../components/ui';
import { BarChart } from '../components/charts';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard({ role, onNav }) {
  const { t } = useTranslation();
  const SERIES_GRAD = {
    "Anchored": "linear-gradient(135deg,#3B5BA5,#1F4E5F)",
    "On Mission": "linear-gradient(135deg,#6E9B7E,#4A7C59)",
    "Stewardship": "linear-gradient(135deg,#B5742E,#8a5520)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up">
        <Card style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, var(--accent)))", border: "none", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -40, opacity: .14 }}><Icon.Cross size={210} sw={1} /></div>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 18 }}>
            <div style={{ maxWidth: 560 }}>
              <Badge style={{ background: "rgba(255,255,255,.2)", color: "#fff" }} dot>Sunday, June 7 · Worship at 10 AM</Badge>
              <h2 style={{ fontSize: 27, fontWeight: 700, color: "#fff", marginTop: 14, letterSpacing: "-0.02em" }}>{t('dashboard.goodMorning')}, Pastor James.</h2>
              <p style={{ fontSize: 15, opacity: .92, marginTop: 6, lineHeight: 1.55 }}>"{t('dashboard.quote')}" — {t('dashboard.communityThriving')}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="soft" icon={Icon.Plus} style={{ background: "rgba(255,255,255,.18)", color: "#fff", border: "1px solid rgba(255,255,255,.25)" }}>{t('dashboard.newEvent')}</Button>
              <Button style={{ background: "#fff", color: "var(--primary)" }} icon={Icon.Mic}>{t('dashboard.uploadSermon')}</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--gap)" }}>
        <Stat icon={Icon.Users} label={t('dashboard.activeMembers')} value="1,240" delta="+28" tint="primary" />
        <Stat icon={Icon.Calendar} label={t('dashboard.eventsThisMonth')} value="12" delta="+3 new" tint="sage" />
        <Stat icon={Icon.Heart} label={t('dashboard.prayerRequests')} value="23" delta="+7 new" tint="warn" />
        <Stat icon={Icon.Hands} label={t('dashboard.activeMinistries')} value="6" tint="primary" />
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "var(--gap)" }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('dashboard.attendanceTrend')}</h3>
          <BarChart data={DB.attendanceTrend} color="var(--primary)" fmt={v => v.toLocaleString()} />
        </Card>
      </div>

      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t('dashboard.upcomingEvents')}</h3>
        {DB.events.filter(e => e.status === "Upcoming").slice(0, 3).map(e => (
          <Card key={e.id} hover style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
                <Icon.Calendar size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600 }}>{e.title}</h4>
                <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>{e.date} at {e.time}</p>
              </div>
              <Badge tone="primary">{e.ministry}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
