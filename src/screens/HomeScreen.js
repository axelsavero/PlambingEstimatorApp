import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { MATERI, countTopik } from '../data/materiData';
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

// Kalkulator dikelompokkan sesuai 3 kategori besar konsep klien
const KALKULATOR = [
  {
    id: 'pondasi',
    label: 'Pondasi',
    items: [
      { screen: 'PondasiScreen', title: 'Pondasi Batu Kali', desc: 'Galian, aanstamping, pasangan', icon: 'layers-outline' },
      { screen: 'FootPlateScreen', title: 'Foot Plate', desc: 'Tapak, pedestal, cor beton', icon: 'grid-outline' },
    ],
  },
  {
    id: 'beton',
    label: 'Beton',
    items: [
      { screen: 'SloofScreen', title: 'Sloof', desc: 'Tulangan, sengkang, cor', icon: 'remove-outline' },
      { screen: 'KolomScreen', title: 'Kolom', desc: 'Dimensi, pembesian, bekisting', icon: 'business-outline' },
      { screen: 'BalokScreen', title: 'Balok', desc: 'Bentang, tulangan, cor', icon: 'cube-outline' },
    ],
  },
  {
    id: 'atap',
    label: 'Atap',
    items: [
      { screen: 'AtapPelanaScreen', title: 'Atap Pelana', desc: 'Kuda-kuda, reng, genteng', icon: 'triangle-outline' },
      { screen: 'AtapLimasScreen', title: 'Atap Limas', desc: 'Jurai, nok, luas atap', icon: 'diamond-outline' },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SkylineWatermarkBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sapaan */}
        <View style={styles.greeting}>
          <Image
            source={require('../../assets/brand/logo_icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.hello}>Halo, Rekan Konstruksi</Text>
            <Text style={styles.helloSub}>Mau mulai dari mana hari ini?</Text>
          </View>
        </View>

        <View style={styles.columns}>
          {/* Panduan Teknis: 4 materi */}
          <View style={styles.colPanduan}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Panduan Teknis</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MateriScreen')} hitSlop={8}>
                <Text style={styles.sectionLink}>Lihat semua</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.list}>
              {MATERI.map((m, i) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.row, i > 0 && styles.rowDivider]}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('MateriScreen', { materiId: m.id })}
                >
                  <View style={styles.rowIcon}>
                    <Ionicons name={m.icon} size={16} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{m.judul}</Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {countTopik(m)} topik · {m.deskripsi}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Kalkulator */}
          <View style={styles.colKalkulator}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Kalkulator</Text>
            </View>

            <View style={styles.groups}>
            {KALKULATOR.map((group) => (
              <View key={group.id} style={styles.group}>
                <Text style={styles.groupLabel}>{group.label}</Text>
                <View style={styles.tiles}>
                  {group.items.map((item) => (
                    <TouchableOpacity
                      key={item.screen}
                      style={styles.tile}
                      activeOpacity={0.6}
                      onPress={() => navigation.navigate(item.screen)}
                    >
                      <Ionicons name={item.icon} size={16} color={colors.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tileTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.tileDesc} numberOfLines={1}>{item.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // flexGrow: konten mengisi tinggi layar; scroll hanya jika layar terlalu pendek
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },

  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  hello: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  helloSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },

  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  colPanduan: {
    flex: 1,
  },
  colKalkulator: {
    flex: 1.3,
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  sectionLink: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },

  // Daftar materi
  list: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 12,
  },
  row: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  rowSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },

  // Kalkulator
  groups: {
    flex: 1,
    gap: 6,
  },
  group: {
    flex: 1,
  },
  groupLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 3,
  },
  tiles: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  tileTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  tileDesc: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
