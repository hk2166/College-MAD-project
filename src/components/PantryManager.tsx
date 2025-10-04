import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppProvider';

export default function PantryManager() {
  const { pantryItems, addPantryItem, removePantryItem } = useAppState();
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      addPantryItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${name}" from your pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removePantryItem(id) },
      ]
    );
  };

  const renderPantryItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.pantryItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add an ingredient..."
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {pantryItems.length > 0 ? (
        <FlatList
          data={pantryItems}
          renderItem={renderPantryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="basket-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Your pantry is empty</Text>
          <Text style={styles.emptySubtext}>
            Add some ingredients to get started!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  addForm: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  pantryItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
});