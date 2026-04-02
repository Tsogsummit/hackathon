#include <bits/stdc++.h>
#define mod 1000000007

using namespace std;

long long power(long long a, long long b){
    long long res = 1;
    while(b > 0){
        if(b % 2 == 1) res *= a;
        a = a * a;
        a %= mod;
        res %= mod;
        b /= 2;
    }
    return res;
}

int main(){
    long long a, b;
    cin >> a >> b;
    cout << power(a, b);
    return 0;
}

