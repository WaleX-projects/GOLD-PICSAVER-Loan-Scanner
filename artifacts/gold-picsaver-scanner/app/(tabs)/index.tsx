import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, Page, PrimaryButton, StatusPill, SyncPill } from '@/components/AppUi';
import { useAppState } from '@/lib/app-state';
import { useColors } from '@/hooks/useColors';

export default function OverviewScreen() {
  const colors = useColors();
  const { applicants, isReady } = useAppState();
  if (!isReady) return <Page scroll={false}><View style={styles.center}><Text style={[styles.loading, { color: colors.mutedForeground }]}>Loading workspace…</Text></View></Page>;
  const pending = applicants.filter((item) => item.status === 'pending_review').length;
  const synced = applicants.filter((item) => item.syncStatus === 'synced').length;
  const recent = applicants.slice(0, 3);
  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header eyebrow="GOLD PICSAVER" title="Good morning, loan officer." subtitle="Keep every application moving, even when the signal drops." />
        <View style={[styles.hero, { backgroundColor: colors.foreground }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}><Feather name="camera" size={22} color={colors.foreground} /></View>
            <Text style={styles.heroKicker}>NEW APPLICATION</Text>
          </View>
          <Text style={styles.heroTitle}>Scan a paper form{'\n'}in seconds.</Text>
          <Text style={styles.heroCopy}>Capture, review, and save your applicant details without retyping.</Text>
          <PrimaryButton label="Start a new scan" icon="arrow-up-right" onPress={() => router.push('/scan')} />
        </View>
        <View style={styles.statsRow}>
          <Stat value={String(pending).padStart(2, '0')} label="Needs review" icon="eye" />
          <Stat value={String(synced).padStart(2, '0')} label="Synced records" icon="check-circle" />
        </View>
        <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent applications</Text><Pressable onPress={() => router.push('/applicants')}><Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text></Pressable></View>
        <View style={[styles.recentList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {recent.map((applicant, index) => <Pressable key={applicant.id} onPress={() => router.push({ pathname: '/applicant/[id]', params: { id: applicant.id } })} style={[styles.applicantRow, index < recent.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{(applicant.data.full_name ?? '?').slice(0, 1).toUpperCase()}</Text></View>
            <View style={styles.applicantCopy}><Text style={[styles.applicantName, { color: colors.foreground }]}>{applicant.data.full_name ?? 'Unnamed applicant'}</Text><Text style={[styles.applicantMeta, { color: colors.mutedForeground }]}>{applicant.data.requested_amount ? `GHS ${applicant.data.requested_amount}` : 'Amount not captured'} · {formatDate(applicant.createdAt)}</Text><View style={styles.pills}><StatusPill status={applicant.status} /><SyncPill status={applicant.syncStatus} /></View></View>
            <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
          </Pressable>)}
        </View>
      </ScrollView>
    </Page>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: keyof typeof Feather.glyphMap }) {
  const colors = useColors();
  return <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={icon} size={17} color={colors.primary} /><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}
function formatDate(value: string) { return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value)); }
const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loading: { fontSize: 14 },
  hero: { borderRadius: 24, padding: 20, gap: 14, marginBottom: 16 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heroIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5d898' },
  heroKicker: { color: '#f5d898', fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  heroTitle: { color: '#fffdf9', fontSize: 28, lineHeight: 32, fontWeight: '700', letterSpacing: -0.6 },
  heroCopy: { color: '#c7c0b6', fontSize: 14, lineHeight: 20, marginBottom: 3 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 27 },
  stat: { flex: 1, minHeight: 108, borderRadius: 18, borderWidth: 1, padding: 14, gap: 7 },
  statValue: { fontSize: 27, fontWeight: '700', letterSpacing: -0.4 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '700' },
  recentList: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  applicantRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13 },
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '700' },
  applicantCopy: { flex: 1, gap: 4 },
  applicantName: { fontSize: 14, fontWeight: '700' },
  applicantMeta: { fontSize: 11 },
  pills: { flexDirection: 'row', alignItems: 'center', gap: 9 },
});