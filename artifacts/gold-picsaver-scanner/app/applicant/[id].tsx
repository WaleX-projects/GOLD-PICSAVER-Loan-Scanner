import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Header, Page, PrimaryButton, StatusPill, SyncPill } from '@/components/AppUi';
import { useAppState } from '@/lib/app-state';
import { useColors } from '@/hooks/useColors';

export default function ApplicantDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getApplicant, template } = useAppState();
  const applicant = getApplicant(id);
  if (!applicant) return <Page scroll={false}><Header title="Applicant not found" onBack={() => router.back()} /></Page>;
  const phone = applicant.data.phone_number;
  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header eyebrow="APPLICANT RECORD" title={applicant.data.full_name || 'Unnamed applicant'} subtitle={`Captured ${formatDate(applicant.createdAt)} · Template v${applicant.templateVersion}`} onBack={() => router.back()} />
        <View style={styles.pills}><StatusPill status={applicant.status} /><SyncPill status={applicant.syncStatus} /></View>
        {phone ? <PrimaryButton label="Call applicant" icon="phone" onPress={() => Linking.openURL(`tel:${phone}`)} /> : null}
        {Object.entries(groupBySection(template.fields)).map(([section, fields]) => <View key={section} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.section, { color: colors.mutedForeground }]}>{section}</Text>{fields.filter((field) => applicant.data[field.key]).map((field, index, visible) => <View key={field.key} style={[styles.valueRow, index < visible.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.mutedForeground }]}>{field.label}</Text><Text style={[styles.value, { color: colors.foreground }]}>{applicant.data[field.key]}</Text></View>)}</View>)}
        <View style={[styles.audit, { backgroundColor: colors.secondary }]}><Feather name="shield" size={17} color={colors.secondaryForeground} /><Text style={[styles.auditText, { color: colors.secondaryForeground }]}>This record is saved locally and ready for sync.</Text></View>
      </ScrollView>
    </Page>
  );
}
function groupBySection(fields: typeof import('@/lib/app-state').GOLD_TEMPLATE.fields) { return fields.reduce<Record<string, typeof fields>>((acc, field) => { (acc[field.section] ??= []).push(field); return acc; }, {}); }
function formatDate(value: string) { return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)); }
const styles = StyleSheet.create({
  content: { paddingBottom: 45, gap: 14 },
  pills: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  card: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingTop: 15, overflow: 'hidden' },
  section: { fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: '700', marginBottom: 3 },
  valueRow: { paddingVertical: 13, gap: 4 },
  label: { fontSize: 11 },
  value: { fontSize: 14, fontWeight: '600' },
  audit: { flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 14, padding: 13, marginTop: 1 },
  auditText: { flex: 1, fontSize: 12, lineHeight: 17 },
});