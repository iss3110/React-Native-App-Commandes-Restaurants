import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlFor } from '../sanity';
import DishRow from '../components/dishRow';
import BasketIcon from '../components/basketIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectRestaurant, setRestaurant } from '../slices/restaurantSlice';
import { emptyBasket } from '../slices/basketSlice';
import * as Icon from 'react-native-feather';
import { themeColors } from '../theme';
import Categories from '../components/categories';
import { getDishesByCategory } from '../api'; // Assurez-vous d'importer la fonction getDishesByCategory

export default function RestaurantScreen() {
    const navigation = useNavigation();
    const restaurant = useSelector(selectRestaurant);
    const [activeCategory, setActiveCategory] = useState(null);
    const [filteredDishes, setFilteredDishes] = useState([]);

    let dispatch = useDispatch();
    const {
        params: {
            id,
            title,
            imgUrl,
            rating,
            type,
            address,
            description,
            dishes,
            lng,
            lat,
        },
    } = useRoute();
    
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    useEffect(() => {
        if (restaurant && restaurant.id !== id) {
            dispatch(emptyBasket());
        }
        dispatch(
            setRestaurant({
                id,
                title,
                imgUrl,
                rating,
                type,
                address,
                description,
                dishes,
                lng,
                lat,
            })
        );
    }, []);

    useEffect(() => {
        if (activeCategory) {
            getDishesByCategory(activeCategory).then(data => {
                setFilteredDishes(data);
            });
        } else {
            setFilteredDishes(dishes);
        }
    }, [activeCategory, dishes]);

    return (
        <>
            <BasketIcon />
            <ScrollView>
                <View className="relative">
                    <View
                        style={{
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                        }}
                        className="relative pt-8 pb-2 shadow bg-white"
                    >
                        {/* search bar */}
                        <View className="flex-row items-center space-x-2 px-2 pt-4">
                            <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300">
                                <Icon.Search height="25" width="25" stroke="gray" />
                                <TextInput
                                    placeholder="Restaurants"
                                    className="ml-2 flex-1"
                                    keyboardType="default"
                                />
                                <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
                                    <Icon.MapPin height="20" width="20" stroke="gray" />
                                    <Text className="text-gray-600">Agadir, Ida Outanane</Text>
                                </View>
                            </View>
                            <View
                                style={{ backgroundColor: themeColors.bgColor(1) }}
                                className="p-3 rounded-full"
                            >
                                <Icon.Sliders height={20} width={20} strokeWidth="2.5" stroke="white" />
                            </View>
                        </View>
                        <Categories setActiveCategory={setActiveCategory} />
                    </View>
                    <Image
                        className="w-full h-72"
                        source={{ uri: urlFor(imgUrl).url() }}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="absolute top-1 left-4 bg-gray-200 p-2 rounded-full shadow"
                    >
                        <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}
                    className="bg-white -mt-12 pt-6"
                >
                    <View className="px-5">
                        <Text className="text-3xl font-bold">{title}</Text>
                        <View className="flex-row space-x-2 my-1">
                            <View className="flex-row items-center space-x-1">
                                <Image
                                    source={require('../assets/images/fullStar.png')}
                                    className="h-4 w-4"
                                />
                                <Text className="text-xs">
                                    <Text className="text-green-700">{rating}</Text>
                                    <Text className="text-gray-700"> (4.6k review)</Text> ·{' '}
                                    <Text className="font-semibold text-gray-700">{type}</Text>
                                </Text>
                            </View>
                            <View className="flex-row items-center space-x-1">
                                <Icon.MapPin color="gray" width={15} height={15} />
                                <Text className="text-gray-800 text-xs">
                                    Adresse : {address}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-gray-500 mt-2">{description}</Text>
                    </View>
                </View>
                <View className="pb-36 bg-white">
                    <Text className="px-4 py-4 text-2xl font-bold">Menu</Text>
                    {/* dishes */}
                    {filteredDishes.map(dish => (
                        <DishRow
                            key={dish._id}
                            id={dish._id}
                            name={dish.name}
                            description={dish.description}
                            price={dish.price}
                            image={dish.image}
                            category={dish.type.name}
                            activeCategory={activeCategory}
                        />
                    ))}
                </View>
            </ScrollView>
        </>
    );
}