var makeHyperspace = function(aLineLength, dimensions, aNumStars) {
    var numStars = aNumStars || 200;
    var canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.style.position = "absolute";
    canvas.style.overflow = "hidden";
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "blue";
    var stars = [];
    var center = {};
    center.x = dimensions.width * .5;
    center.y = dimensions.height * .5;
    var lineLength = Math.max(aLineLength, 1);

    for (var i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height
        });
    }
    var findEnd = function(star, aLineLength, aCenter) {
        var direction = Math.atan2(star.y - aCenter.y, star.x - aCenter.x);

        var returnVal = {
            x: star.x + (aLineLength * Math.cos(direction)),
            y: star.y + (aLineLength * Math.sin(direction))
        };
        //  console.log("therefore",returnVal);
        return returnVal;

    }

    var renderStar = function(result) {
        /*console.log(result.x,result.y)*/
        end = findEnd(result, lineLength, center);


        ctx.moveTo(result.x, result.y);
        ctx.lineTo(end.x, end.y);





    }
    var render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        stars.forEach(renderStar);
        ctx.stroke();
    }
    render();
    return {
        canvas: canvas,

        set length(n) {
            lineLength = n;

            render();
        },
        get length() {
            return lineLength;
        }
    }
}
