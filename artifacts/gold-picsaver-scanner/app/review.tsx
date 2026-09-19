import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FieldInput, Header, Page, PrimaryButton, SectionLabel, SecondaryButton } from '@/components/AppUi';
import { useAppState } from '@/lib/app-state';
import { useColors } from '@/hooks/useColors';

const mockValues: Record<string, string> = {
  full_name: 'Amara Johnson',
  date_of_birth: '14 / 08 / 1991',
  gender: 'Female',
  marital_status: 'Married',
  email_address: 'amara.johnson@email.com',
  phone_number: '+233 24 555 0182',
  residential_address: '12 Independence Avenue, Accra',
  id_type: 'National ID',
  id_number: 'GHA-234-8841',
  current_employer: 'Johnson Trading Co.',
  job_title: 'Managing Director',
  monthly_net_income: '8,400',
  other_income_source: 'Wholesale distribution',
  work_address: 'Makola Market, Accra',
  requested_amount: '24,000',
  loan_tenure_months: '18',
  purpose_of_loan: 'Inventory expansion',
  bank_name: 'GCB Bank',
  account_number: '014900228774',
};

export default function ReviewScreen() {
  const colors = useColors();
  const { template, addApplicant } = useAppState();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [values, setValues] = useState<Record<string, string>>(mockValues);
  const [saving, setSaving] = useState(false);
  const grouped = useMemo(() => template.fields.reduce<Record<string, typeof template.fields>>((acc, field) => { (acc[field.section] ??= []).push(field); return acc; }, {}), [template.fields]);
  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const save = async () => {
    const missing = template.fields.filter((field) => field.required && !values[field.key]?.trim());
    if (missing.length) { Alert.alert('A few fields need attention', `Complete ${missing[0].label} before saving.`); return; }
    setSaving(true);
    await addApplicant({ data: values, imageUri, confidence: Object.fromEntries(template.fields.map((field) => [field.key, field.key === 'phone_number' || field.key === 'id_number' ? 0.78 : 0.96])) });
    setSaving(false);
    router.replace('/(tabs)/applicants');
  };
  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header eyebrow="REVIEW SCAN" title="Check the details" subtitle="AI extraction is ready. Review highlighted fields before saving." onBack={() => router.back()} />
        <View style={[styles.notice, { backgroundColor: colors.accent }]}><Text style={[styles.noticeTitle, { color: colors.accentForeground }]}>19 fields found</Text><Text style={[styles.noticeCopy, { color: colors.accentForeground }]}>Fields with a gold outline need a quick look.</Text></View>
        {Object.entries(grouped).map(([section, fields]) => <View key={section} style={styles.section}><SectionLabel>{section}</SectionLabel>{fields.map((field) => <FieldInput key={field.key} label={field.label} required={field.required} value={values[field.key] ?? ''} onChangeText={(value) => setValue(field.key, value)} lowConfidence={field.key === 'phone_number' || field.key === 'id_number'} keyboardType={field.type === 'number' ? 'numeric' : field.type === 'phone' ? 'phone-pad' : field.type === 'email' ? 'email-address' : 'default'} />)}</View>)}
        <View style={styles.actions}><SecondaryButton label="Save as draft" onPress={() => router.back()} /><PrimaryButton label={saving ? 'Saving…' : 'Save applicant'} icon="check" disabled={saving} onPress={save} /></View>
      </ScrollView>
    </Page>
  );
}
const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  notice: { borderRadius: 15, padding: 14, marginBottom: 22, gap: 4 },
  noticeTitle: { fontSize: 14, fontWeight: '700' },
  noticeCopy: { fontSize: 12 },
  section: { marginBottom: 8 },
  actions: { gap: 10, marginTop: 10 },
});