import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header, Page, StatusPill, SyncPill } from '@/components/AppUi';
import { useAppState } from '@/lib/app-state';
import { useColors } from '@/hooks/useColors';

export default function ApplicantsScreen() {
  const colors = useColors();
  const { applicants, isReady } = useAppState();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => applicants.filter((item) => (item.data.full_name ?? '').toLowerCase().includes(query.toLowerCase()) || (item.data.phone_number ?? '').includes(query)), [applicants, query]);
  return (
    <Page>
      <Header eyebrow="WORKSPACE" title="Applicants" subtitle={`${applicants.length} records in your local workspace`} />
      <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={18} color={colors.mutedForeground} /><TextInput value={query} onChangeText={setQuery} placeholder="Search by name or phone" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} /></View>
      {!isReady ? <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Loading applicants…</Text> : <FlatList data={filtered} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} ListEmptyComponent={<View style={styles.empty}><Feather name="users" size={24} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No applicants found</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try a different search or start a new scan.</Text></View>} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: '/applicant/[id]', params: { id: item.id } })} style={({ pressed }) => [styles.row, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}><View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{(item.data.full_name ?? '?').slice(0, 1).toUpperCase()}</Text></View><View style={styles.copy}><Text style={[styles.name, { color: colors.foreground }]}>{item.data.full_name ?? 'Unnamed applicant'}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.data.phone_number ?? 'No phone number'} · {formatDate(item.createdAt)}</Text><View style={styles.pills}><StatusPill status={item.status} /><SyncPill status={item.syncStatus} /></View></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>} />}
    </Page>
  );
}
function formatDate(value: string) { return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)); }
const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 9, height: 50, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 14 },
  list: { gap: 10, paddingBottom: 110 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 18, padding: 13 },
  avatar: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  copy: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700' },
  meta: { fontSize: 11 },
  pills: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 9 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 13, textAlign: 'center' },
});