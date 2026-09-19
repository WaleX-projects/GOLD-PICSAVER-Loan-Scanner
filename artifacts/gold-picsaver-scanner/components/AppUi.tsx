import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const content = <View style={[styles.page, { backgroundColor: colors.background }]}>{children}</View>;
  return scroll ? <View style={styles.flex}>{content}</View> : content;
}

export function Header({ eyebrow, title, subtitle, onBack }: { eyebrow?: string; title: string; subtitle?: string; onBack?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {onBack ? <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}><Feather name="arrow-left" size={22} color={colors.foreground} /></Pressable> : null}
        <View style={styles.headerCopy}>
          {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        </View>
      </View>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryButton({ label, icon, onPress, disabled = false }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress: () => void; disabled?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: disabled ? 0.45 : pressed ? 0.82 : 1 }]}>
      {icon ? <Feather name={icon} size={18} color={colors.primaryForeground} /> : null}
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, icon, onPress }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryButton, { backgroundColor: colors.secondary, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}>
      {icon ? <Feather name={icon} size={17} color={colors.secondaryForeground} /> : null}
      <Text style={[styles.secondaryButtonText, { color: colors.secondaryForeground }]}>{label}</Text>
    </Pressable>
  );
}

export function FieldInput({ label, value, onChangeText, placeholder, keyboardType, lowConfidence, required }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'; lowConfidence?: boolean; required?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}{required ? ' *' : ''}</Text>
        {lowConfidence ? <View style={[styles.reviewFlag, { backgroundColor: colors.accent }]}><Feather name="alert-circle" size={12} color={colors.accentForeground} /><Text style={[styles.reviewFlagText, { color: colors.accentForeground }]}>Check scan</Text></View> : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        style={[styles.input, { backgroundColor: colors.card, borderColor: lowConfidence ? colors.primary : colors.input, color: colors.foreground }]}
      />
    </View>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{children}</Text>;
}

export function StatusPill({ status }: { status: string }) {
  const colors = useColors();
  const label = status === 'pending_review' ? 'Pending review' : status === 'active' ? 'Active' : status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status;
  const tone = status === 'approved' ? '#2d7a59' : status === 'rejected' ? colors.destructive : status === 'pending_review' ? colors.primary : '#4c7189';
  return <View style={[styles.statusPill, { backgroundColor: `${tone}18` }]}><View style={[styles.statusDot, { backgroundColor: tone }]} /><Text style={[styles.statusText, { color: tone }]}>{label}</Text></View>;
}

export function SyncPill({ status }: { status: string }) {
  const colors = useColors();
  const labels: Record<string, string> = { pending: 'Pending upload', syncing: 'Syncing', synced: 'Synced', failed: 'Failed' };
  return <View style={styles.syncPill}><Feather name={status === 'synced' ? 'check-circle' : status === 'failed' ? 'alert-circle' : 'upload-cloud'} size={13} color={colors.mutedForeground} /><Text style={[styles.syncText, { color: colors.mutedForeground }]}>{labels[status] ?? status}</Text></View>;
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading your workspace…</Text></View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerCopy: { flex: 1 },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 7 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 8 },
  primaryButton: { minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 18 },
  primaryButtonText: { fontSize: 15, fontWeight: '700' },
  secondaryButton: { minHeight: 48, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 15 },
  secondaryButtonText: { fontSize: 14, fontWeight: '600' },
  field: { marginBottom: 17 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600' },
  input: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontSize: 15 },
  reviewFlag: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 },
  reviewFlagText: { fontSize: 10, fontWeight: '700' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.15, textTransform: 'uppercase', marginTop: 7, marginBottom: 12 },
  statusPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  syncPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  syncText: { fontSize: 11, fontWeight: '500' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14 },
});