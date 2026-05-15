// 목적지 검색 (Places Autocomplete) + 결과 드롭다운
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { searchPlaces, getPlaceDetails } from '../services/placesApi';

const DEBOUNCE_MS = 250;

export default function SearchBar({ currentLocation, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const items = await searchPlaces(query, currentLocation);
        setResults(items);
      } catch (e) {
        console.warn('Places search 실패:', e.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, currentLocation]);

  const handlePick = async (item) => {
    try {
      const detail = await getPlaceDetails(item.placeId);
      setQuery(item.mainText);
      setResults([]);
      onSelect && onSelect({ ...detail, description: item.description });
    } catch (e) {
      console.warn('Place details 실패:', e.message);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.inputRow}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="어디로 갈까요?"
          returnKeyType="search"
        />
        {loading && <ActivityIndicator style={{ marginRight: 8 }} />}
      </View>
      {results.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(it) => it.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => handlePick(item)}>
                <Text style={styles.main}>{item.mainText}</Text>
                {!!item.secondaryText && (
                  <Text style={styles.sub}>{item.secondaryText}</Text>
                )}
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { fontSize: 16, marginRight: 6 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
  dropdown: {
    backgroundColor: '#fff',
    marginTop: 6,
    borderRadius: 12,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: { paddingVertical: 12, paddingHorizontal: 14, borderBottomColor: '#eee', borderBottomWidth: 1 },
  main: { fontSize: 15, color: '#222' },
  sub: { fontSize: 12, color: '#888', marginTop: 2 },
});
