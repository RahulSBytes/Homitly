// hack to merge additional data

export default function dataWithAvgRating(data) {
  let calAvgRating = data.map((item) => {
    let count = 0.0001;
    let avgrating = item.comments.reduce((acc, curr) => {
      count++;
      return acc + curr.rating;
    }, 0);

    return {
      ...item.toObject(),
      avgrating: (avgrating / count).toFixed(1),
    };
  });

  return calAvgRating;
}
