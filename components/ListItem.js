import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ListItem = ({item, handleClick}) => {
    return (
        <TouchableOpacity onPress={()=>handleClick(item.id)}>
            <View style={item.viewStyle}>
                <Text style={item.textStyle}>
                    {item.text}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  listItemView: {
        padding:15,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5
    },
    highlight: {
        backgroundColor:'#ECF87F',
        padding: 15,
    },
    strikeThrough: {
        fontSize:18,
        textDecorationLine: 'line-through'
    }, 
    none: {
        fontSize:18,
        textDecorationLine: 'none'
    }
});

export default ListItem;