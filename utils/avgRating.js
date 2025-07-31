// hack to merge additional data

export default function dataWithAvgRating(data) {
  let calAvgRating = data.map((item) => {
    let avgrating = item.comments.reduce((acc, curr) => {
      return acc + curr.rating;
    }, 0);

    return {
      ...item.toObject(),
      avgrating: avgrating/5,
    };
  });

  return calAvgRating;
}
