import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorites = useCallback(async () => {
    if (!currentUser) {
      console.error('User not signed in');
      alert('Please sign in to add to favorites.');
      return;
    }
  
    if (!movieId) {
      console.error('Movie ID is required');
      return;
    }
  
    try {
      let response;
  
      if (isFavorite) {
        response = await axios.delete('/api/favorite', { data: { movieId } });
      } else {
        response = await axios.post('/api/favorite', { movieId });
      }
  
      const updatedFavoriteIds = response?.data?.favoriteIds;
      mutateFavorites(); // Cập nhật danh sách yêu thích sau khi thêm/xóa
    } catch (error: unknown) {
      // Kiểm tra xem error có phải là Error không
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        // Bạn có thể xử lý thêm thông điệp lỗi cho người dùng nếu cần
      } else {
        console.error('An unknown error occurred', error);
      }
    }
  }, [movieId, isFavorite, currentUser, mutateFavorites]);
  

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div 
      onClick={toggleFavorites} 
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
    >
      <Icon className='text-white' size={25}/>
    </div>
  );
};

export default FavoriteButton;
