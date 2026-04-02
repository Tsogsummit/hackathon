//https://www.spoj.com/CSMS/problems/ULS_2016_2_2/
#include <bits/stdc++.h>
#define pb push_back

using namespace std;
struct point{
    double x;
    double y;
    point()
    {
        x = y = 0.0;
    }
};

point p[100005], pt;

bool cmp(point a, point b){
    if(a.y == b.y) return a.x > b.x;
    return a.y < b.y;
}

double dist(point a, point b){
    return hypot(a.x - b.x, a.y - b.y);
}

bool cmp1(point a, point b){
    double x1 = a.x - pt.x;
    double x2 = b.x - pt.x;
    double y1 = a.y - pt.y;
    double y2 = b.y - pt.y;
    if(atan2(y1, x1) == atan2(y2, x2)) return dist(a, pt) > dist(b, pt);
    return atan2(y1, x1) < atan2(y2, x2);
}

bool dir(point a, point b, point c) {
    return 0 < (a.x * b.y - a.y * b.x) + (b.x * c.y - b.y * c.x) + (c.x * a.y - c.y * a.x);
    
}

vector<point > convex;

int main(){
    int i , j , n , t;
    cin >> n;
    for(i = 1 ; i <= n ; i++) cin >> p[i].x >> p[i].y;
    sort(p + 1 , p + n + 1 , cmp);
    pt = p[1];
    sort(p + 2 , p + n + 1 , cmp1);
    convex.pb(pt);
    convex.pb(p[2]);
    j = 3;
    int sz = 2;
    while(j <= n){
        if(dir(convex[sz - 2], convex[sz - 1], p[j])){
            convex.pb(p[j]);
            j++;
            sz++;
        }
        else{
            convex.pop_back();
            sz--;
        }
    }
    sz = convex.size();
    cout << sz << '\n';
    return 0;
}
