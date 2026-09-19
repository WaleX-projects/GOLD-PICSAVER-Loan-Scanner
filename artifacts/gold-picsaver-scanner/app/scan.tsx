import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, Page, PrimaryButton, SecondaryButton } from '@/components/AppUi';
import { useColors } from '@/hooks/useColors';
import { useAppState } from '@/lib/app-state';

export default function ScanScreen() {
  const colors = useColors();
  const { template } = useAppState();
  const [pages, setPages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const capture = async () => {
    setBusy(true);
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { Alert.alert('Camera access needed', 'Allow camera access to photograph the application form.'); return; }
      }
      const result = Platform.OS === 'web'
        ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75 })
        : await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.75 });
      if (!result.canceled && result.assets[0]?.uri) setPages((current) => [...current, result.assets[0].uri]);
    } finally { setBusy(false); }
  };
  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header eyebrow="NEW APPLICATION" title="Scan the form" subtitle={`Using ${template.name} · version ${template.version}`} onBack={() => router.back()} />
        <View style={[styles.cameraCard, { backgroundColor: colors.foreground }]}>
          <View style={[styles.scanFrame, { borderColor: '#f5d898' }]}>
            <View style={[styles.corner, styles.tl, { borderColor: '#f5d898' }]} /><View style={[styles.corner, styles.tr, { borderColor: '#f5d898' }]} /><View style={[styles.corner, styles.bl, { borderColor: '#f5d898' }]} /><View style={[styles.corner, styles.br, { borderColor: '#f5d898' }]} />
            {pages[0] ? <Image source={{ uri: pages[0] }} style={styles.preview} /> : <View style={styles.cameraPlaceholder}><Text style={styles.cameraTitle}>Place the full form inside the frame</Text><Text style={styles.cameraCopy}>Keep the page flat and make sure all fields are legible.</Text></View>}
          </View>
          <Pressable onPress={capture} disabled={busy} style={({ pressed }) => [styles.captureButton, { backgroundColor: '#f5d898', opacity: busy ? 0.5 : pressed ? 0.8 : 1 }]}><View style={styles.captureInner} /></Pressable>
          <Text style={styles.cameraHint}>{pages.length ? `${pages.length} page${pages.length === 1 ? '' : 's'} captured` : 'Tap to photograph page 1'}</Text>
        </View>
        {pages.length > 0 ? <View style={[styles.pageTray, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.trayTitle, { color: colors.foreground }]}>Captured pages</Text><View style={styles.thumbs}>{pages.map((uri, index) => <View key={`${uri}-${index}`} style={styles.thumbWrap}><Image source={{ uri }} style={styles.thumb} /><Text style={[styles.thumbLabel, { color: colors.mutedForeground }]}>Page {index + 1}</Text></View>)}<SecondaryButton label="Add page" icon="plus" onPress={capture} /></View></View> : null}
        <View style={styles.bottom}><PrimaryButton label={pages.length ? 'Review extracted fields' : 'Take a photo to continue'} icon="arrow-right" disabled={!pages.length} onPress={() => router.push({ pathname: '/review', params: { imageUri: pages[0] } })} /></View>
      </ScrollView>
    </Page>
  );
}
const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  cameraCard: { borderRadius: 24, padding: 18, alignItems: 'center', gap: 15 },
  scanFrame: { height: 310, width: '100%', borderWidth: 1, borderRadius: 16, position: 'relative', overflow: 'hidden' },
  corner: { position: 'absolute', width: 22, height: 22, zIndex: 2 },
  tl: { top: 14, left: 14, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 14, right: 14, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 14, left: 14, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 14, right: 14, borderBottomWidth: 3, borderRightWidth: 3 },
  preview: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.74 },
  cameraPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 38, gap: 8 },
  cameraTitle: { color: '#fffdf9', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  cameraCopy: { color: '#c7c0b6', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  captureButton: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#1f1d1a' },
  cameraHint: { color: '#c7c0b6', fontSize: 12 },
  pageTray: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 14, gap: 13 },
  trayTitle: { fontSize: 14, fontWeight: '700' },
  thumbs: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  thumbWrap: { gap: 5 },
  thumb: { width: 55, height: 68, borderRadius: 8, resizeMode: 'cover' },
  thumbLabel: { fontSize: 10 },
  bottom: { marginTop: 18 },
});